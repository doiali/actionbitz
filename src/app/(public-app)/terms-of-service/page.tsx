import { Metadata } from 'next'
import TermsOfService from './terms-of-service.mdx';

export const metadata: Metadata = {
  title: 'ActionBitz - Terms of Service',
}

export default function TermsOfServicePage() {
  return (
    <div className="container prose dark:prose-invert mx-auto my-16">
      <TermsOfService />
    </div>
  );
}