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

/*
* @param {org.asset-network.com.CreateCompleteParticipant} participant - model instance
* @transaction
*/
async function createCompleteParticipant(participant) {   // eslint-disable-line no-unused-vars
  await createParticipant(participant) //create the participant resource
  await issueIdentity(participant) //issue an identity for use with this participant
  await createAccount(participant) //create 1 account for our new participant

}

/*
* @param {org.asset-network.com.RemoveCompleteParticipant} participant - model instance
* @transaction
*/
async function removeCompleteParticipant(participant) {   // eslint-disable-line no-unused-vars
  await removeParticipant(participant) //remove the participant resource
  await revokeIdentity(participant) //revoke all identity for use with this participant
  await removeAllAccounts(participant) //remove all accounts for our new participant

}

/*
* @param {org.asset-network.com.CreateParticipant} participant - model instance
* @transaction
*/
async function createParticipant(participant) {   // eslint-disable-line no-unused-vars

  const participantRegistry = await getParticipantRegistry('org.asset-network.com.' + create.accountType);
  const participantToCreate = {
    "$class": "org.asset-network.com." + create.accountType,
    "address1": create.address1,
    "address2": create.address2,
    "country": create.country,
    "postcode": create.postcode,
    "userId": create.userId,
    "email": create.email,
    "firstName": create.address1,
    "lastName": create.address1,
    "accountType": create.accountType,
  }

  await participantRegistry.add(participantToCreate);
}

/* Purpose:
* @param {org.asset-network.com.DeleteParticipant} participant - model instance
* @transaction
*/
async function removeParticipant(participant) {   // eslint-disable-line no-unused-vars
  const participantRegistry = await getParticipantRegistry('org.asset-network.com.' + create.accountType);

  await participantRegistry.remove(participantToCreate);

}


/****************** PARTICIPANT ACTIONS: END ******************/
/****************** ACCOUNT ACTIONS: START ******************/

/* global getAssetRegistry
* @param {org.asset-network.com.Transfer} transfer - model instance
* @transaction
*/
async function transferAsset(transfer) {   // eslint-disable-line no-unused-vars

  if(transfer.amount <= 0) return console.error("Amount to transfer must be greater than 0")

  const accountRegistry = await getAssetRegistry('org.asset-network.com.Account');
  //check balance of 'from' and 'to'

  //XXX check identity of function caller with fromAccount owner

  const from = await accountRegistry.get(transfer.fromAccount.accountId)
  const to = await accountRegistry.get(transfer.toAccount.accountId)

  //if balance is sufficient, sub and add
  if(transfer.amount > from.balance) return console.error("'FROM' has insufficient funds to complete this transaction")
  from.balance -= transfer.amount
  to.balance += transfer.amount

  await accountRegistry.updateAll([from, to]);
  //await accountRegistry.update(to);
}

/*
* @param {org.asset-network.com.FreezeAccount} account - model instance
* @transaction
*/
async function freezeAccount(account) {   // eslint-disable-line no-unused-vars
  const accountRegistry = await getAssetRegistry('org.asset-network.com.Account');
  const accountToEdit = await accountRegistry.get(account.accountId)

  //if balance is sufficient, sub and add
  accountToEdit.frozen = true;

  await accountRegistry.update(accountToEdit);
}

/*
* @param {org.asset-network.com.ThawAccount} account - model instance
* @transaction
*/
async function thawAccount(account) {   // eslint-disable-line no-unused-vars
  const accountRegistry = await getAssetRegistry('org.asset-network.com.Account');
  const accountToEdit = await accountRegistry.get(account.accountId)

  //if balance is sufficient, sub and add
  accountToEdit.frozen = false;

  await accountRegistry.update(accountToEdit);

}

/*
* @param {org.asset-network.com.CreateAccount} account - model instance
* @transaction
*/
async function createAccount(account) {   // eslint-disable-line no-unused-vars
  const accountRegistry = await getAssetRegistry('org.asset-network.com.Account');
  const accountToAdd = {
    owner: account.owner,
    frozen: false
  }

  await accountRegistry.add(accountToAdd);

}

/*
* @param {org.asset-network.com.RemoveAccount} account - model instance
* @transaction
*/
async function removeAccount(account) {   // eslint-disable-line no-unused-vars
  const accountRegistry = await getAssetRegistry('org.asset-network.com.Account');

  await accountRegistry.remove(accountToEdit);

}

/*
* @param {org.asset-network.com.RemoveAllAccounts} account - model instance
* @transaction
*/
async function removeAllAccounts(account) {   // eslint-disable-line no-unused-vars


}

/*
* @param {org.asset-network.com.SchedulePayment} account - model instance
* @transaction
*/
async function scheduleRecurringPayment(account) {   // eslint-disable-line no-unused-vars


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
