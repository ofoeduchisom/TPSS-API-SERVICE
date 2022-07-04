import express, { json } from 'express';

const router = express.Router();


router.post('/split-payments/compute', (req, res) => {
    const payment = req.body;

    if (payment.SplitInfo < 1 || payment.SplitInfo > 20) {
        res.status(400).send('SplitInfoArray must be equal to or between 1 and 20.');
    }



    const splitResponse = {
        ID: 0,
        Balance: 0,
        SplitBreakdown: [
        ]
    }

    var balance = payment.Amount;

    //flat calculation
    const splitInfosFlat = payment.SplitInfo.filter((splits) => splits.SplitType == "FLAT");

    for (let i = 0; i < splitInfosFlat.length; i++) {

        const item = splitInfosFlat[i];       
        balance = balance - item.SplitValue
        var obj = {};
        obj["SplitEntityId"] = item.SplitEntityId;
        obj["Amount"] = item.SplitValue;
        splitResponse.SplitBreakdown.push(obj);
    }

    //percentage
    const splitInfosPercentage = payment.SplitInfo.filter((splits) => splits.SplitType == "PERCENTAGE");
    for (let i = 0; i < splitInfosPercentage.length; i++) {
        const item = splitInfosPercentage[i];  
        var percentage = item.SplitValue / 100 * balance     
        balance = balance - percentage
        var obj = {};
        obj["SplitEntityId"] = item.SplitEntityId;
        obj["Amount"] = percentage;
        splitResponse.SplitBreakdown.push(obj);
    }


      //ratio
      const splitInfosRatio = payment.SplitInfo.filter((splits) => splits.SplitType == "RATIO");

      let ratioSum = 0;
      for (let i = 0; i < splitInfosRatio.length; i++) {
        const item = splitInfosRatio[i];
        ratioSum = ratioSum + item.SplitValue
      }
      
      payment.SplitInfo.map(item => item.SplitValue).reduce((prev, curr) => prev + curr, 0);



      for (let i = 0; i < splitInfosRatio.length; i++) {
          const item = splitInfosRatio[i];  
          var ratio = item.SplitValue / ratioSum * balance     
          var obj = {};
          obj["SplitEntityId"] = item.SplitEntityId;
          obj["Amount"] = ratio;
          splitResponse.SplitBreakdown.push(obj);
      }


    splitResponse.ID = payment.ID;
    splitResponse.Balance = balance;
    res.json(splitResponse);
});

export default router;