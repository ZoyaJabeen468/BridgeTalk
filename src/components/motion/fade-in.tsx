"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

/**
 * Fades and slides content up into view. Plays once when it first
 * enters the viewport.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 18,
  once = true,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

/**
 * Gently scales content up from a slightly-smaller, transparent state.
 * Used for product artifacts (frames, cards) to feel like they settle
 * into place.
 */
export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = 0.7,
  once = true,
}: ScaleInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}

/**
 * Wraps a group of `StaggerItem` children and reveals them one after
 * another as the group scrolls into view.
 */
export function StaggerChildren({
  children,
  className,
  once = true,
}: StaggerChildrenProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
      variants={staggerContainerVariants}
    >
      {children}
    </motion.div>
  );
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

/** A single item inside `StaggerChildren`. Must be a direct-ish descendant. */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}
