#!/bin/sh

CID=$(echo $1 | sed 's/0x/x/g')

echo $CID

psql -U blockscout -h 192.168.0.108 -c "update public.addresses set contract_code = '//' where hash = E'\\\\$CID';"

