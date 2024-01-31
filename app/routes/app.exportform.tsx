import { ActionFunction, redirect } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import {
  Button,
  Card,
  Layout,
  Page,
  Popover,
  ResourceListProps,
  Text,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import {
  ResourceListExample,
  itemsResource,
} from "~/components/CustomResourceList";
import { productsQuery } from "~/graphql/productsQuery";
import { authenticate } from "~/shopify.server";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const response = await admin.graphql(`
  #graphql
    mutation {
        bulkOperationRunQuery(
    query: """
     ${productsQuery}
 """
    ) {
    bulkOperation {
      id
      status
      query
      rootObjectCount
      type
      partialDataUrl
      objectCount
      fileSize
      createdAt
      url
    }
    userErrors {
      field
      message
    }
  }
} 
`);

  if (response.ok) {
    const data = await response.json();
    console.log(data.data.bulkOperationRunQuery.bulkOperation, "data");

    //pass values function

    return redirect("/app/exportresult");
  }

  return null;
};

const ExportForm = (props: Props) => {
  const [activate, setActivte] = useState(false);

  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  console.log(selectedItems, "selectedItems");

  const toggleActive = useCallback(
    () => setActivte((activate) => !activate),
    [],
  );

  const submit = useSubmit();
  const actiondata = useActionData<typeof action>();
  console.log(actiondata, "actiondatahook");

  const activator = (
    <Button onClick={toggleActive} disclosure>
      select sheets
    </Button>
  );

  const createExport = () => {
    submit(
      {},
      {
        replace: true,
        method: "POST",
        action: "/app/exportform",
      },
    );
  };

  return (
    <Page>
      <ui-title-bar title="New Export">
        <button variant="breadcrumb">Home</button>
        <button onClick={() => {}}>Back</button>
        <button variant="primary" onClick={createExport}>
          Export
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="p" fontWeight="bold">
              Format: CSV
            </Text>
          </Card>
          <br />
          <Card>
            <div style={{ position: "relative" }}>
              <Popover
                activator={activator}
                onClose={toggleActive}
                fullWidth
                autofocusTarget="first-node"
                active={activate}
              >
                <ResourceListExample
                  items={itemsResource}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              </Popover>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ExportForm;
