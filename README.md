## panda-composer
### Fabric Network Setup
If you haven't already, install Composer pre-reqs here: https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html
After you have installed the pre-reqs, open a terminal in this directory `panda-composer`
Run the following commands:
`npm install`
`npm install -g composer-cli`
`npm install -g composer-rest-server`
`npm install -g generator-hyperledger-composer`
`npm install -g yo`
`npm install -g composer-playground`

Hyperledger also recommends you use VSCode as your editor (with composer plugin)

I have already included the `fabric-dev-servers` scripts, so you will not need to download those.
`cd fabric-dev-servers`
`./downloadFabric.sh`

To start the Fabric network, run the following command:
`cd fabric-dev-servers`
`./startFabric.sh`
`./createPeerAdminCard.sh`

You can start and stop your runtime using `fabric-dev-servers/stopFabric.sh`, and start it again with `fabric-dev-servers/startFabric.sh`.

At the end of your development session, you run `fabric-dev-servers/stopFabric.sh` and then `fabric-dev-servers/teardownFabric.sh`. Note that if you've run the teardown script, the next time you start the runtime, you'll need to create a new PeerAdmin card just like you did on first time startup

### Composer/Business Network Setup
#### To start (your first time)
Assuming you have already completed the `./createPeerAdminCard.sh` step in the previous section,
run the following commands:
To install the bna:
`composer network install --card PeerAdmin@hlfv1 --archiveFile panda@0.0.x.bna`
(be sure to substitute `panda@0.0.x.bna` for the latest version you have)

If you do not have a `.bna` archive file, use this command to generate one:
`composer archive create -t dir -n .`

To start the bna:
`composer network start --networkName panda --networkVersion 0.0.x --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card`
(be sure to substitute `0.0.x` for the latest version you have)

Import network admin card:
`composer card import --file networkadmin.card`

Test your network:
`composer network ping --card admin@panda`

#### To upgrade (after making changes)
Whenever changes are made to a `.qry`, `.acl`, or `.cto` file, the Business Network must be re-archived (we generate a new `.bna` file with a new version number i.e. `panda@0.0.2.bna` becomes `panda@0.0.3.bna`)

After changing the files in a business network (`.qry`, `.acl`, or `.cto` files), the business network must be repackaged as a business network archive (.bna) and redeployed to the Hyperledger Fabric instance. Upgrading a deployed network requires that the new version being deployed have a new version number.

In the panda-composer directory, open the package.json file.

Update the version property from 0.0.x to 0.0.x+1.

Using the command line, navigate to the panda-composer directory.

Run the following command be sure to input the correct/latest `.bna` file name/version:
`composer archive create --sourceType dir --sourceName . -a panda@0.0.x.bna`
(be sure to substitute `panda@0.0.x.bna` for your generated filename)

Run the following command to install the updated business network:
`composer network install --card PeerAdmin@hlfv1 --archiveFile panda@0.0.x.bna`
(be sure to substitute `panda@0.0.x.bna` for your generated filename)

Then, complete the upgrade:
`composer network upgrade -c PeerAdmin@hlfv1 -n panda -V 0.0.x`
(be sure to substitute `0.0.x.` for your latest version)

Confirm the network is upgraded:
`composer network ping -c admin@panda | grep Business`

### Generate REST-API server (necessary for testing queries/updates to network and ledger)
From the panda-composer directory:
`composer-rest-server`
Enter admin@panda as the card name.
Select never use namespaces when asked whether to use namespaces in the generated API.
Select No when asked whether to secure the generated API.
Select Yes when asked whether to enable event publication.
Select No when asked whether to enable TLS security.
The generated API is connected to the deployed blockchain and business network.
NOTE: these options selections are for development purposes only
To skip the previous selection process, enter the following command:
`composer-rest-server -c admin@panda -n never -w true`

The API server will run on localhost:3000

### Start Angular4 app (optional)
Navigate to the angular-app directory:
If you haven't yet, run `npm install`
Then, run `npm start`
The client-app will run on localhost:4200


##ISSUES
Using my Windows machine (I know) with Docker terminal, the command `composer network install --card PeerAdmin@hlfv1 --archiveFile panda@0.0.x.bna` resulted in the following error: "Response from attempted peer comms was an error: Error: 14 UNAVAILABLE: Connect Failed".

To fix this, I had to make a few changes to the file located at `panda-composer/fabric-dev-servers/fabric-scripts/hlfv11/createPeerAdminCard.sh`
Within this file, copy/past the following at the beginning of the function definitions:
CYGDIR="$(cygpath -pw "$DIR")"
if [[ ! -v DOCKER_HOST ]]; then
echo "DOCKER_HOST is NOT set <<<< Please set the env for Docker !!!!"
DOCKER_IP=$DOCKER_IP
else
DOCKER_IP="${DOCKER_HOST:6}"
INDEX=`expr index "${DOCKER_IP}" :`
echo $INDEX
DOCKER_IP="${DOCKER_IP:0:(INDEX-1)}"
fi
echo  "Using the Docker VM IP Address: ${DOCKER_IP}"

After this is complete, replace all occurrences of `localhost` with $DOCKER_IP within this file (there should only be 1 occurrence)

This fix can be found in greater detail at https://stackoverflow.com/questions/49625575/hyperledger-composer-network-install

------------------------------

To remove all previous Docker images and containers which may be running, run the following command:
`docker kill $(docker ps -q)`
`docker rm $(docker ps -aq)`
`docker rmi $(docker images dev-* -q)`

------------------------------

If `composer-rest-server` is not reflecting changes your recent changes to the Composer project, trying updating the version number in `package.json`, and running the instructions above for upgrading a business network on a running Fabric network.
