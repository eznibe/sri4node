#!/bin/bash
cat sql/schema.sql sql/testdata.sql | sudo sudo -u postgres psql $PSQL_VERSION_OPT
