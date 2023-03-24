import { cva } from 'class-variance-authority'
import React from 'react'

type ChipProps = {
    label: string | JSX.Element,
    icon?: JSX.Element,
    intent?: 'primary' | 'secondary',
}

const chip = cva('flex items-center justify-center rounded-full px-2 py-1 text-xs gap-1', {
    variants: {
        intent: {
            primary: 'bg-purple-600 text-white',
            secondary: 'bg-green-600 text-white',
        }
    },
    defaultVariants: {
        intent: 'primary',
    },
});

export default function Chip({ label, icon, intent = 'primary'}: ChipProps) {
  return (
    <div className={chip({ intent })}>
        {icon} {label}
    </div>
  )
}
