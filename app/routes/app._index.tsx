import { Link } from "@remix-run/react";
import { Box, Button, Card, Layout, Page, Text } from "@shopify/polaris";
import React from "react";
import { CustomCalledOut } from "~/components/CustomCalledOut";
import { DropZoneExample } from "~/components/CustomDropZone";
import { Placeholder } from "~/components/Placeholder";

type Props = {};

const Index = (props: Props) => {
  return (
    <Page>
      <ui-title-bar title="Bulky operations"></ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="h4" variant="headingMd">
              Export
            </Text>
            <br />
            <Text as="h6">
              You will be able to select the particular data items to export
            </Text>
            <br />
            <Link to="/app/exportform">
              <Button variant="primary">New Export</Button>
            </Link>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Text as="h4" variant="headingMd">
              Import
            </Text>
            <DropZoneExample />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Box background="bg-fill-info" borderRadius="100">
              <Placeholder label="You have 0 scheduled jobs" />
            </Box>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Text as="h4" variant="headingMd">
            Help
          </Text>
          <br />

          <CustomCalledOut
            title={"Support"}
            illustration={""}
            primaryActionContent={"Contact Support"}
            primaryActionUrl={""}
            children={
              "If you have any questions, issues, missing features or concerns - don't guess, don't wait - contact us and we will help you."
            }
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
