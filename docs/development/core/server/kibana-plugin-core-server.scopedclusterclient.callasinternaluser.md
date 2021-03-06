<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-core-server](./kibana-plugin-core-server.md) &gt; [ScopedClusterClient](./kibana-plugin-core-server.scopedclusterclient.md) &gt; [callAsInternalUser](./kibana-plugin-core-server.scopedclusterclient.callasinternaluser.md)

## ScopedClusterClient.callAsInternalUser() method

Calls specified `endpoint` with provided `clientParams` on behalf of the Kibana internal user. See [APICaller](./kibana-plugin-core-server.apicaller.md)<!-- -->.

<b>Signature:</b>

```typescript
callAsInternalUser(endpoint: string, clientParams?: Record<string, any>, options?: CallAPIOptions): Promise<any>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  endpoint | <code>string</code> | String descriptor of the endpoint e.g. <code>cluster.getSettings</code> or <code>ping</code>. |
|  clientParams | <code>Record&lt;string, any&gt;</code> | A dictionary of parameters that will be passed directly to the Elasticsearch JS client. |
|  options | <code>CallAPIOptions</code> | Options that affect the way we call the API and process the result. |

<b>Returns:</b>

`Promise<any>`

