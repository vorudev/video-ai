import {
    ConsentManagerDialog,
    ConsentManagerProvider,
    CookieBanner,
  } from '@c15t/nextjs';
  import type { ReactNode } from 'react';
  
  export default function ConsentManager({ children }: { children: ReactNode }) {
    return (
      <ConsentManagerProvider
        options={{
          translations: {
            defaultLanguage: 'ru',
            translations: {
            ru: {
              common: {
                acceptAll: 'Принять',
         rejectAll: 'Только необходимые',
         customize: 'Настройки',
         save: 'Сохранить',
              },
              cookieBanner: {
                title: 'Мы используем cookie',
                description: 'Этот сайт использует файлы cookie для обеспечения работы сервиса, улучшения пользовательского опыта и анализа трафика.',
          
              },
        consentTypes: {
          marketing: {
            title: 'Маркетинг',
            description: 'Мы используем рекламные cookie для рекламы.',
          }, 
          necessary: {
            title: 'Необходимые',
            description: 'Необходимые cookie обеспечивают базовую функциональность сайта.',
          },
          
          
        },
        consentManagerDialog: {
          title: 'Настройки cookie',
          description: 'Выберите, какие cookie вы хотите разрешить.',
  
        
          
        },
        
          
            },
          },
          },
          mode: 'c15t',
          backendURL: 'https://clipreel-europe-onboarding.c15t.dev',
          consentCategories: ['necessary', 'marketing'], // Optional: Specify which consent categories to show in the banner.
          ignoreGeoLocation: true, // Useful for development to always view the banner.
        }}
      >
        <CookieBanner />
        <ConsentManagerDialog />
        {children}
      </ConsentManagerProvider>
    );
  }