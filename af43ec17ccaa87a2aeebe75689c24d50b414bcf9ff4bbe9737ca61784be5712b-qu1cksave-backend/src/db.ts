import { Pool } from "pg";
import fs from 'fs';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: +(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || "dev",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  // To solve "no pg_hba.conf entry" error:
  // - https://stackoverflow.com/questions/76899023/rds-while-connection-error-no-pg-hba-conf-entry-for-host
  // Why readFileSync (synchronous) is fine for reading SSL certificates:
  // - https://stackoverflow.com/questions/17604866/difference-between-readfile-and-readfilesync
  // readFileSync does not need closing?
  // - https://stackoverflow.com/questions/75798375/explicitly-closing-a-file-after-readfilesync

  // COMMENT THIS OUT IF IN DEV MODE
  // ssl: { 
  //   // require: true, // Does not exist
  //   rejectUnauthorized: true,
  //   // ca: fs.readFileSync('src/ca_cert/us-west-1-bundle.pem').toString(), 
  //   ca: fs.readFileSync('us-west-1-bundle.pem').toString(), 
  // }
});

export { pool };

// Useful info for connecting to an AWS RDS database
//   Public accessible, VPC, subnet, internet gateway, VPC security groups
// - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_CommonTasks.Connect.html#CHAP_CommonTasks.Connect.ScenariosForAccess
// - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.Scenarios.html#USER_VPC.Scenario4
// - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html
// - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_SettingUp.html#CHAP_SettingUp.SecurityGroup
// - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.Connecting
// - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html#USER_ConnectToPostgreSQLInstance.Troubleshooting
// - https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.Modifying.html#USER_ModifyInstance.Settings
