import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Transaction = Tables<"transactions">;

export function useRealtimeTransactions(entityId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Fetch initial transactions
    const fetchTransactions = async () => {
      let query = supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (entityId) {
        query = query.eq("entity_id", entityId);
      }

      const { data } = await query;
      if (data) {
        setTransactions(data);
      }
    };

    fetchTransactions();

    // Set up realtime subscription
    const channel = supabase
      .channel("transactions-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          ...(entityId ? { filter: `entity_id=eq.${entityId}` } : {}),
        },
        (payload) => {
          console.log("New transaction:", payload);
          setTransactions((prev) => [payload.new as Transaction, ...prev].slice(0, 50));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entityId]);

  return { transactions, isConnected };
}
