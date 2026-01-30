import { Container, Box } from '@mui/material';
import SurveyForm from '../components/SurveyForm';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>KT지니원-설문조사</title>
        <meta name="description" content="KT지니원 올인원 패키지 설문조사" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Container maxWidth="md">
        <Box>
          <SurveyForm />
        </Box>
      </Container>
    </>
  );
} 