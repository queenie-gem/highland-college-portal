"use client";

import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = localStorage.getItem("adminUser");
    if (getUser) {
      try {
        const user = JSON.parse(getUser) as User;
        setUser(user);
      } catch (error) {}
    }
  }, []);

  return user;
}
