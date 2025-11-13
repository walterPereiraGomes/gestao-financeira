'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Interface para opções do select
export interface SelectOption {
  id: string;
  label: string;
  value: string;
}

// Props do componente seguindo Interface Segregation Principle
export interface VirtualizedSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string, option?: SelectOption) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

// Componente principal usando Shadcn/ui Command + Popover
const VirtualizedSelect = React.forwardRef<
  HTMLButtonElement,
  VirtualizedSelectProps
>(
  (
    {
      options,
      value,
      onValueChange,
      isLoading = false,
      disabled = false,
      placeholder = 'Selecione uma opção',
      searchPlaceholder = 'Buscar...',
      className = '',
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = React.useCallback(
      (currentValue: string) => {
        const option = options.find((opt) => opt.value === currentValue);
        onValueChange(currentValue === value ? '' : currentValue, option);
        setOpen(false);
      },
      [options, value, onValueChange],
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            disabled={disabled || isLoading}
            className={cn(
              'justify-between',
              !selectedOption && 'text-muted-foreground',
              'bg-white font-normal text-black hover:border-gray-300 hover:bg-white hover:text-black',
              className,
            )}
          >
            {isLoading
              ? 'Carregando...'
              : selectedOption
                ? selectedOption.label
                : placeholder}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 text-gray-500 opacity-50 hover:text-gray-300' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0'>
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className='h-9'
              disabled={isLoading}
            />
            <CommandList>
              {isLoading ? (
                <div className='text-muted-foreground py-6 text-center text-sm'>
                  <div className='flex items-center justify-center'>
                    <svg
                      className='mr-3 h-4 w-4 animate-spin'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Carregando...
                  </div>
                </div>
              ) : (
                <>
                  <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.value}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === option.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

VirtualizedSelect.displayName = 'VirtualizedSelect';

export default VirtualizedSelect;
