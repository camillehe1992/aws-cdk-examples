console.log("Loading function");

exports.handler = async (event, context) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));
  for (const record of event.Records) {
    // Kinesis data is base64 encoded so decode here
    const payload = Buffer.from(record.kinesis.data, "base64").toString(
      "ascii"
    );
    console.log("Decoded payload:", payload);
  }
  return `Successfully processed ${event.Records.length} records.`;
};
