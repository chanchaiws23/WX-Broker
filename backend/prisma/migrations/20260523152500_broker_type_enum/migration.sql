CREATE TYPE "BrokerType" AS ENUM ('cfd', 'bond', 'stock', 'crypto');

ALTER TABLE "Broker"
  ALTER COLUMN "brokerType" TYPE "BrokerType"
  USING "brokerType"::"BrokerType";
