'use client';

import React from 'react';
import {NextIntlClientProvider} from 'next-intl';

interface IntlProviderClientProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export default function IntlProviderClient({
  children,
  locale,
  messages
}: IntlProviderClientProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        if (error.code === 'MISSING_MESSAGE') {
          return;
        }

        console.error(error);
      }}
      getMessageFallback={({key}) => key}
    >
      {children}
    </NextIntlClientProvider>
  );
}