import { Text } from '@gluestack-ui/themed';
import React from 'react';
import { TextStyle } from 'react-native';

type CurrencyFormatterProps = {
    amount: number | undefined;
    currency?: 'IDR' | 'USD';
    locale?: string;
    style?: TextStyle
    maxDigits?: boolean;
};
const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({
    amount,
    currency = 'IDR',
    locale = 'id-ID',
    style,
    maxDigits
}) => {
    const formatCurrency = (amount: number | undefined, currency: string, locale: string) => {
        if (amount === undefined) return `${currency === 'IDR' ? 'Rp' : '$'} 0.00`;

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const Maks = formatCurrency(amount, currency, locale)
        ? String(formatCurrency(amount, currency, locale)).substring(0, 8) + '...'
        : '';

    return <Text style={style}>{maxDigits ? Maks : formatCurrency(amount, currency, locale)}</Text>;
};

export { CurrencyFormatter };
