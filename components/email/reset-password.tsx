import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import Image from 'next/image';

interface ForgotPasswordEmailProps {
  username: string;
  resetUrl: string;
  userEmail: string
}
const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {

  return (
    <Html lang="ru" dir="ltr">
    <Head />
    <Preview>Восстановление пароля</Preview>
    <Tailwind>
      <Body className="bg-white py-10 font-sans">
        <Container className="mx-auto px-10 py-10 rounded-lg max-w-[600px]">
          {/* Logo */}
          <Section className="text-center mb-8">
         <Text className="text-3xl text-black font-bold mb-4 mt-0">
            ClipReel
         </Text>
          </Section> 

          {/* Header */}
          <Section className="text-center">
            <Heading className="text-3xl text-black font-bold mb-4 mt-0">
              Восстановление пароля 
            </Heading>
          </Section>

          {/* Main Content */}
          <Section className="mb-9">
            <Text className="text-base text-center text-gray-600 leading-relaxed mb-6 mt-0">
              Для восстановления пароля нажмите на кнопку ниже.
            </Text>

            <Button 
              className="bg-black text-white mb-4 px-6 py-3 rounded-md text-center block mx-auto" 
              href={`${props.resetUrl}reset-password`}
            >
              Восстановление пароля
            </Button>

            <Text className="text-gray-600 text-sm text-center leading-5 mt-0">
              Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:
            </Text>

            <Text className="text-blue-500 text-center text-sm leading-5 mb-6 mt-0 break-all">
            {`${props.resetUrl}reset-password`}
            </Text>

            <Text className="text-gray-600 text-sm text-center leading-5 mb-6 mt-0">
              Если вы не запрашивали восстановление пароля, пожалуйста, проигнорируйте это письмо.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
  );
};

export default ForgotPasswordEmail;