import { Metadata } from 'next'
import PrivacyPolicy from './privacy-policy.mdx';

export const metadata: Metadata = {
  title: 'ActionBitz - Privacy Policy',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container prose dark:prose-invert mx-auto my-16">
      <PrivacyPolicy />
    </div>
  );
}