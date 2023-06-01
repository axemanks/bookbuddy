// this utility will merge tailwind classes together
// example: left-0 right-0 => inset-x-0

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}