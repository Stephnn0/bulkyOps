import { LegacyCard, ResourceItem, ResourceList, Text } from "@shopify/polaris";
import { ResourceListSelectedItems } from "@shopify/polaris/build/ts/src/utilities/resource-list";
export const itemsResource: { id: string; title: string }[] = [
  {
    id: "products",
    title: "Products",
  },
  {
    id: "customers",
    title: "Customers",
  },
  {
    id: "orders",
    title: "Orders",
  },
];

interface CustomResourceItemProps {
  id: string;
  title: string;
}

interface ResourceListExampleProps {
  items: CustomResourceItemProps[];
  selectedItems: ResourceListSelectedItems | undefined;
  setSelectedItems:
    | ((selectedItems: ResourceListSelectedItems) => void)
    | undefined;
}

export function ResourceListExample(props: ResourceListExampleProps) {
  const { items, selectedItems, setSelectedItems } = props;

  return (
    <LegacyCard>
      <ResourceList
        resourceName={{ singular: "Entity", plural: "Entities" }}
        items={items}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        renderItem={(items) => {
          const { id, title } = items;
          return (
            <ResourceItem
              id={id}
              onClick={(id) => {
                console.log(id, "resoruce items");
              }}
              name={title}
            >
              <Text as="h3" fontWeight="bold" variant="bodyMd">
                {title}
              </Text>
            </ResourceItem>
          );
        }}
      ></ResourceList>
    </LegacyCard>
  );
}
