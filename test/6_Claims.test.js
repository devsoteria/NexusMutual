const NXMToken1 = artifacts.require('NXMToken1');
const NXMToken2 = artifacts.require('NXMToken2');
const NXMTokenData = artifacts.require('NXMTokenData');
const Claims = artifacts.require('Claims');
const ClaimsData = artifacts.require('ClaimsData');
const QuotationData = artifacts.require('QuotationData');
const PoolData = artifacts.require('PoolData');
const MCR = artifacts.require('MCR');
const member = web3.eth.accounts[1];
const receiver = web3.eth.accounts[2];
const coverHolder = web3.eth.accounts[4];

const { assertRevert } = require('./utils/assertRevert');
const CLA = '0x434c41';
let cl;
let nxmtk1;
let nxmtd;
let qd;
let cd;
let pd;
let m1;
const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

describe('Contract: 06_claims', function() {
  before(function() {
    NXMTokenData.deployed()
      .then(function(instance) {
        td = instance;
        return QuotationData.deployed();
      })
      .then(function(instance) {
        qd = instance;
        return Claims.deployed();
      })
      .then(function(instance) {
        cl = instance;
        return ClaimsData.deployed();
      })
      .then(function(instance) {
        cd = instance;
        return PoolData.deployed();
      })
      .then(function(instance) {
        pd = instance;
      });
  });
  it('should able to submit Claim for his cover', async function() {
    const coverID = await qd.getAllCoversOfUser(coverHolder);
    const coverOwner = await qd.getCoverMemberAddress(coverID[0]);
    let coverDet1 = await qd.getCoverDetailsByCoverID1(coverID[0]);
    let coverDet2 = await qd.getCoverDetailsByCoverID2(coverID[0]);
    coverDet1 = await qd.getCoverDetailsByCoverID1(coverID[1]);
    coverDet2 = await qd.getCoverDetailsByCoverID2(coverID[1]);
    coverOwner.should.equal(coverHolder);
    const cStatus = await qd.getCoverDetailsByCoverID1(coverID[0]);
    cStatus[4].should.equal('0x41637469766500000000000000000000'); // ||'0x436c61696d2044656e69656400000000000000000000' ||'0x52657175657374656400000000000000000000'
    const sumAssured = await qd.getCoverSumAssured(coverID[0]);
    const coverCurr = await qd.getCurrencyOfCover(coverID[0]);
    const claimId = await cd.actualClaimLength();
    const initialCurrencyAssetVarMin = await pd.getCurrencyAssetVarMin(
      coverCurr
    );
    const coverStatus = await qd.getCoverStatusNo(coverID[0]);
    await cl.submitClaim(coverID[0], { from: coverHolder });
    const presentCurrencyAssetVarMin = await pd.getCurrencyAssetVarMin(
      coverCurr
    );
    const claimDetails = await cd.getAllClaimsByIndex(claimId);
    claimDetails[0].should.be.bignumber.equal(coverID[0]);
    newCoverStatus = (await qd.getCoverStatusNo(coverID[0])).toNumber();
    newCoverStatus.should.equal(4);
    const calculatedCurrencyAssetVarMin = initialCurrencyAssetVarMin.plus(
      sumAssured
    );
    calculatedCurrencyAssetVarMin.should.be.bignumber.equal(
      presentCurrencyAssetVarMin
    );
  });

  it('should not able to submit Claim for cover with status submmited,accepted,5 times denied', async function() {
    const coverID = await qd.getAllCoversOfUser(coverHolder);
    await assertRevert(cl.submitClaim(coverID[0]));
  });
});