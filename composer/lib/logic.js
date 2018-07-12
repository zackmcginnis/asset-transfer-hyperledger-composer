/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

/****************** PARTICIPANT ACTIONS: START ******************/

/****************** PARTICIPANT ACTIONS: END ******************/
/****************** ACCOUNT ACTIONS: START ******************/

/* global getAssetRegistry
* @param {org.asset-network.com.Transfer} transfer - model instance
* @transaction
*/
async function transferVehicle(transfer) {   // eslint-disable-line no-unused-vars
  transfer.vehicle.owner = transfer.newOwner;
  let assetRegistry = await getAssetRegistry('org.asset-network.com.Vehicle');
  await assetRegistry.update(transfer.vehicle);
}



/****************** ACCOUNT ACTIONS: END ******************/
/****************** HISTORIAN ACTIONS: START ******************/
/*
* @param {org.asset-network.com.GetUserTransactionHistory} history - model instance
* @transaction
*/
async function getUserTransactionHistory(history) {
  let historian = await businessNetworkConnection.getHistorian();
  let historianRecords = await historian.getAll();
  console.log(prettyoutput(historianRecords));
  //
  //
  //add more
}

/*
* @param {org.asset-network.com.GetAccountTransactionHistory} history - model instance
* @transaction
*/
async function getAccountTransactionHistory(history) {
  let historian = await businessNetworkConnection.getHistorian();
  let historianRecords = await historian.getAll();
  console.log(prettyoutput(historianRecords));
  //
  //
  //add more
}
/****************** HISTORIAN ACTIONS: END ******************/
