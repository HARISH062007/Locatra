"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function AnimatedCounter({ value, className }: { value: string | number, className?: string }) {
  const numericValue = typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
  const isNumber = !isNaN(numericValue);

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  const display = useTransform(spring, (current) => {
    return Math.floor(current).toString();
  });

  useEffect(() => {
    if (isNumber) {
      spring.set(numericValue);
    }
  }, [numericValue, isNumber, spring]);

  if (!isNumber) return <span className={className}>{value}</span>;

  return <motion.span className={className}>{display}</motion.span>;
}
