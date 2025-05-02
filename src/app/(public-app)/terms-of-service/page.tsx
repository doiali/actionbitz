import { Metadata } from 'next'
import TermsOfService from './terms-of-service.mdx';

export const metadata: Metadata = {
  title: 'Actionbitz - Terms of Service',
  description: 'Read the terms of service for Actionbitz to understand our policies and guidelines.',
  keywords: ['Actionbitz', 'Terms of Service', 'Policies', 'Guidelines'],
}

export default function TermsOfServicePage() {
  return (
    <div className="container prose dark:prose-invert mx-auto my-16">
      <TermsOfService />
    </div>
  );
}