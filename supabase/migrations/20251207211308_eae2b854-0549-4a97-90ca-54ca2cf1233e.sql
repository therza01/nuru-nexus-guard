-- Create enum for alert severity
CREATE TYPE public.alert_severity AS ENUM ('critical', 'high', 'medium', 'low');

-- Create enum for case status
CREATE TYPE public.case_status AS ENUM ('open', 'investigating', 'escalated', 'resolved', 'closed');

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  severity alert_severity NOT NULL DEFAULT 'medium',
  entity_id TEXT,
  entity_type TEXT,
  entity_name TEXT,
  risk_score INTEGER DEFAULT 0,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cases table
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID REFERENCES public.alerts(id) ON DELETE SET NULL,
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status case_status NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  priority alert_severity NOT NULL DEFAULT 'medium',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case notes table
CREATE TABLE public.case_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table for real-time monitoring
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  counterparty TEXT,
  channel TEXT,
  status TEXT DEFAULT 'completed',
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts (all authenticated users can read)
CREATE POLICY "Authenticated users can view alerts"
ON public.alerts FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for cases
CREATE POLICY "Authenticated users can view cases"
ON public.cases FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create cases"
ON public.cases FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update assigned cases"
ON public.cases FOR UPDATE
TO authenticated
USING (auth.uid() = assigned_to OR auth.uid() = created_by);

-- RLS Policies for case notes
CREATE POLICY "Authenticated users can view case notes"
ON public.case_notes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create notes"
ON public.case_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- RLS Policies for transactions
CREATE POLICY "Authenticated users can view transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (true);

-- Enable realtime for transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Create triggers for updated_at
CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON public.alerts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON public.cases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample alerts data
INSERT INTO public.alerts (title, description, severity, entity_id, entity_type, entity_name, risk_score, location) VALUES
('Multiple SIM Swap Detected', 'Phone number +254 722 345 678 has undergone 3 SIM swaps in 24 hours', 'critical', 'phone_1', 'phone', '+254 722 345 678', 92, 'Nairobi'),
('Suspicious Transaction Pattern', 'Unusual transaction velocity detected on Paybill 522XXX', 'high', 'paybill_1', 'paybill', 'Paybill 522XXX', 89, 'Westlands'),
('Device Sharing Alert', 'Android-IMEI-3580721 used by 4 different phone numbers', 'critical', 'device_1', 'device', 'Android-IMEI-3580721', 95, 'Kilimani'),
('Cross-Cluster Transaction', 'Transaction between high-risk clusters A and B detected', 'high', 'phone_5', 'phone', '+254 768 123 456', 82, 'Mombasa'),
('New High-Risk Entity', 'New account KCB-XXXX4567 linked to known fraud network', 'medium', 'account_1', 'account', 'KCB-XXXX4567', 78, 'Kisumu'),
('IP Address Anomaly', 'VPN/Proxy detected from IP 41.89.XXX.XXX', 'high', 'ip_1', 'ip', '41.89.XXX.XXX', 91, 'Nakuru'),
('Rapid Fund Movement', 'KES 2.5M moved through multiple accounts in 1 hour', 'critical', 'account_2', 'account', 'Equity-XXXX8901', 88, 'Nairobi'),
('After-Hours Activity', 'Unusual transaction activity between 2-4 AM', 'medium', 'phone_3', 'phone', '+254 711 234 567', 75, 'Eldoret');