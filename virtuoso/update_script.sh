#!/bin/bash

ENDPOINT='http://34.95.142.122:8890/sparql'
USERNAME='dba'
PASSWORD='root'
GRAPH_IRI='http://zatti.alexandre/OntoReD'
RDF_FILE_PATH='./comics.owl'
DIR=$(dirname $(realpath $0))
FILE_URI="file://$DIR/$RDF_FILE_PATH"

curl -X POST -H "Content-Type: application/sparql-update" -u $USERNAME:$PASSWORD --data "
CLEAR GRAPH <$GRAPH_IRI>
" "$ENDPOINT"

#curl -X POST -H "Content-Type: application/sparql-update" -u $USERNAME:$PASSWORD --data "
#LOAD <$FILE_URI> INTO GRAPH <$GRAPH_IRI>
#" "$ENDPOINT"

curl -X POST -H "Content-Type: application/sparql-update" -u $USERNAME:$PASSWORD --data "
LOAD <http://34.95.142.122:8890/DAV/$RDF_FILE_NAME> INTO GRAPH <$GRAPH_IRI>
" "$ENDPOINT"