import { LoaderFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Banner, Card, Layout, Page, ProgressBar } from "@shopify/polaris";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { authenticate } from "~/shopify.server";
import Papa from "papaparse";

type bulkOperation = {
  id: String;
  url: String;
  status: String;
  completedAt: String;
  startedAt: String;
  format: String;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
  currentBulkOperation {
    id
    status
    errorCode
    createdAt
    completedAt
    objectCount
    fileSize
    url
    partialDataUrl
  }
}
    `,
  );

  if (response.ok) {
    console.log("----------status export result ------");
    const data = await response.json();
    console.log(data, "responseeeeee");

    return json(await data.data.currentBulkOperation);
  }

  return null;
};

const ExportResult = () => {
  const data: bulkOperation = useLoaderData<typeof loader>();

  const [pollingData, setPollingData] = useState(data);
  const [shouldPoll, setShouldPoll] = useState(true);
  const [readyUrl, setReadyUrl] = useState("");

  useEffect(() => setPollingData(data), [data]);

  const fetcher = useFetcher();

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && shouldPoll) {
        fetcher.load("/app/exportresult");
      }
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [shouldPoll, fetcher.load]);

  useEffect(() => {
    if (fetcher.data) {
      setPollingData(fetcher.data as bulkOperation);

      const { status, url } = fetcher.data as bulkOperation;

      setReadyUrl(url as string);

      if (status === "COMPLETED") {
        setShouldPoll(false);
        console.log("----polling stopped----");
      }
    }
  }, [fetcher.data]);

  const downloadData = async () => {
    try {
      console.log("download");

      const response = await axios.get(readyUrl);

      const lines = response.data.split("\n");

      const jsonArray = lines
        .map((line: any) => {
          try {
            return JSON.parse(line);
          } catch (err) {
            console.log("error parsing the data", err);
            return null;
          }
        })
        .filter(Boolean);

      const csvData = Papa.unparse(jsonArray);

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      link.download = "output.csv";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(data, "data");
  return (
    <Page>
      <ui-title-bar title="New Export">
        <button variant="breadcrumb">Bulky</button>
        <button onClick={() => {}}>Back</button>
        <button variant="primary">Download Exported File</button>
      </ui-title-bar>

      {pollingData.status === "RUNNING" && (
        <Layout>
          <Layout.Section>
            <Banner title="Export in Progress">
              <ProgressBar progress={75} />
            </Banner>
            <br />
            <Card>
              <p>in progresss</p>
              <p>ID: {pollingData.id}</p>
              <p>STATUS: {pollingData.status}</p>
            </Card>
          </Layout.Section>
        </Layout>
      )}

      {pollingData.status === "COMPLETED" && (
        <Layout>
          <Layout.Section>
            <Banner
              title="Export Finished"
              tone="success"
              action={{
                content: "Download Exported File",
                onAction: downloadData,
              }}
            >
              <br />
              <Card>
                <p>ID: {pollingData.id}</p>
                <p>STATUS: {pollingData.status}</p>
                <p>URL: {pollingData.url}</p>
              </Card>
            </Banner>
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
};

export default ExportResult;
