import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface LinearLoginCodeEmailProps {
  url: string,
  host: string,
  escapedHost: string,
  baseUrl: string,
}

// const escapedHost = host.replace(/\./g, "​.")

export const LinearLoginCodeEmail = ({
  url, host, escapedHost, baseUrl
}: LinearLoginCodeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Sign in to {host}​</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section
            style={{
              backgroundColor: "#000000",
              display: "flex",
              padding: "0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={`${baseUrl}/actionbitz.png`}
              width="240"
              height="126"
              style={{
                width: '100%',
              }}
              alt="Actionbitz"
            />
          </Section>
          <Heading style={heading}>Sign in to {escapedHost}</Heading>
          <Section style={buttonContainer}>
            <Button style={button} href={url}>
              Sign in
            </Button>
          </Section>
          <Text style={paragraph}>
            This link will only be valid for the next 5 minutes. If you did not request this email you can safely ignore it.
          </Text>
          <Hr style={hr} />
          <Link href={baseUrl} style={brandLink}>
            {escapedHost}
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

LinearLoginCodeEmail.PreviewProps = {
  url: "#",
  host: "actionbitz.com",
} as LinearLoginCodeEmailProps

export default LinearLoginCodeEmail

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
}

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
}

const buttonContainer = {
  padding: "27px 0 27px",
}

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
}

const brandLink = {
  fontSize: "14px",
  color: "#b4becc",
}

const hr = {
  borderColor: "#dfe1e4",
  margin: "42px 0 26px",
}
