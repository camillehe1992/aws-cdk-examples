#!/usr/bin/bash

# producer 
aws kinesis put-record \
  --stream-name stailer-ordering-stream \
  --data "user1 signup" \
  --partition-key user1 \
  --cli-binary-format raw-in-base64-out

# consumer

# describe the stream
aws kinesis describe-stream --stream-name stailer-ordering-stream

# consume some data
aws kinesis get-shard-iterator --stream-name stailer-ordering-stream \
  --shard-id shardId-000000000000 \
  --shard-iterator-type TRIM_HORIZON

aws kinesis get-records --shard-iterator <>

# use https://www.base64decode.com/ to convert base64 to string