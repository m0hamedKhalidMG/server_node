import { Cover, Questions } from "../models/questionScheme.js";
import results from "../models/resultScheme.js";
import cron from "node-cron";
import validator from 'validator';

export async function getqestions(req, res) {
 // try {
    const title = 'phase 1';

    const q = await Questions.find({}).select("-answers").populate({
      path: "cover",
      match: { title: title,active:true },
    });
  const filteredQ = q.filter((doc) => doc.cover !== null);

  /*  const options = {
      timeZone: "Europe/Bucharest",
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    
    const currentDate = new Date();
    
    const easternEuropeTime = currentDate.toLocaleString("en-US", options);
    
    const date = easternEuropeTime.match(/[a-zA-Z]{3}, [a-zA-Z]{3} \d{2}, \d{4}/)[0];
    
    const localTime = currentDate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Europe/Bucharest",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    
    
    const [dateS, timeS] = filteredQ[0].cover.starttime.split("&");
    console.log(date);
    console.log(dateS);
    console.log(localTime);
    console.log(timeS);
    const [hours1, minutes1, secondswithpm ] = localTime.split(":");
    const [seconds1 ,localPeriod] =  secondswithpm.split("\u202f");
console.log(localPeriod)
    const [hours2, minutes2, second2swithpm] = timeS.split(":");
    const [seconds2 ,localPeriod2] =  second2swithpm.split(" ");
    const totalSeconds1 =
      parseInt(hours1) * 3600 + parseInt(minutes1) * 60 + parseInt(seconds1);
    const totalSeconds2 =
      parseInt(hours2) * 3600 + parseInt(minutes2) * 60 + parseInt(seconds2);
    const differenceInSeconds = totalSeconds1 - totalSeconds2;
    console.log(differenceInSeconds + "s");
    const due = filteredQ[0].cover.duration * 60;
    const timedown = due - differenceInSeconds;
    var minute = parseInt(timedown / 60);
    var sec = timedown % 60;
    if (minute < 0) {
      minute = 0;
      sec = 0;
    }
    if (dateS <= date && timeS <= localTime&&localPeriod2===localPeriod&&sec>0) {
      console.log(minute + ":" + sec);

      
    
      console.log(filteredQ);*/
     const timedown = 305 - 10;

      var sec = timedown % 60;
      var minute = parseInt(timedown / 60);

      console.log(filteredQ)
 const options = {
      timeZone: "Europe/Bucharest",
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    
    const currentDate = new Date();
    
    const easternEuropeTime = currentDate.toLocaleString("en-US", options);
    
    const date = easternEuropeTime.match(/[a-zA-Z]{3}, [a-zA-Z]{3} \d{2}, \d{4}/)[0];
    
    const localTime = currentDate.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Europe/Bucharest",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    
 console.log(date);
    console.log(localTime);
 res.json({ filteredQ,minute, sec});
    //} else {
    ///  res.json({ error });
   // }
 // } catch (error) {
  //  res.json({ error });
 // }
   // }
  
}
export async function delcover(req, res) {
  const id = req.params.id;

  Cover.findByIdAndDelete(id)
    .then((deletedcover) => {
      if (!deletedcover) {
        return res.status(404).json({ error: "cover not found" });
      } else {
        Questions.findOneAndDelete({ cover: id }).then((deleted) => {
          console.log(deleted);
          if (deleted)
            return res.json({
              message: "cover deleted successfully and question",
              deletedcover,
            });
          else
            return res.json({
              message: "cover deleted successfully ",
              deletedcover,
            });
        });
      }
    })
    .catch((error) => {
      return res.json({ message: "error ", error });
    });
}
export async function updatecover(req, res) {
  const { id, newObject } = req.body;

  Cover.findByIdAndUpdate(id, newObject, { new: true })
    .then((Updatedcover) => {
      console.log("Updatedcover:", Updatedcover);
      res.json({ msg: "Data Saved Successfully...!" });
    })
    .catch((error) => {
      res.json({ msg: "Error...!" });

      console.error("Error Updatedcover:", error);
    });
}
export async function insertqestions(req, res) {
  try {
    const { all, title } = req.body;
    const questions = all.questions;
    const answers = all.answers;
    const updatedDocument = await Questions.updateOne(
      { cover: title },
      {
        $push: { questions: { $each: questions }, answers: { $each: answers } },
      },
      { upsert: true }
    );

    res.json({ msg: "Data Saved Successfully...!" });
  } catch (error) {
    res.json({ error });
  }
}
export async function dropqestions(req, res) {
  try {
    await Questions.deleteMany({});
    res.json({ mes: "drop questions " });
  } catch (error) {
    res.json({ error });
  }
}
export async function getresult(req, res) {
  try {
    const q = await results.find({});
    res.json(q);
  } catch (error) {
    res.json({ error });
  }
}
export async function storeresult(req, res) {
  //await results.deleteMany()
  const result = new results(req.body);
  const re=result.result;
  const {answers} = await Questions.findOne({ cover: result.idcover });
  if (answers) {
 console.log(answers)}
  console.log("re",result)
  let degree = 0;
  answers.map((item, index) => {
      if(item.ans===String(re[index]+1)){
        degree++;
      }
    })
    result.degree = degree;
  result.save()
  .then(doc => {
    res.send({message:"seccuess in store",degree})
  })
  .catch(err => {
    console.error('Error while saving user :', err);

    return res.status(400).json({error: err.message });

   // res.send('error while saving user');
  });

  
}
export async function dropresult(req, res) {
  try {
    res.json({ mes: "dropresult" });
  } catch (error) {
    res.json({ error });
  }
}
export async function insertcover(req, res) {
  console.log(req.body)

    const newObject =new Cover(req.body);
    const {  duration, num, maxMark } =
      newObject;
      if (!validator.isNumeric(num)) {
        return res.status(400).json({ error: 'Invalid num of question format'   });
      }
      if (!validator.isNumeric(duration)) {
        return res.status(400).json({ error: 'Invalid duration of question format'   });
      }
      if (!validator.isNumeric(maxMark)) {
        return res.status(400).json({ error: 'Invalid maxMark of question format'   });
      }
      newObject.save()
      .then(doc => {
        console.log(doc)
        return res.status(200).json({ message: 'ADD successful' });
      })
      .catch(err => {
        console.error('Error while saving user :', err);
    
        return res.status(400).json({error: err.message });
    
      });
    
    }

export async function dropcover(req, res) {
  try {
    await Questions.deleteMany({});
    res.json({ mes: "drop questions " });
  } catch (error) {
    res.json({ error });
  }
}
export async function getcover(req,  res) {
  try {
    const q = await Cover.find({});
    res.json(q);
  } catch (error) {
    res.json({ error });
  }
} 
export async function getqestionsBYID(req, res) {
  try {
    const id = req.params.id;

    const q = await Questions.findOne({ cover: id });
    if (q) {
      console.log(q);
      res.json(q);
    } else return res.status(404).json({ error: "Questionsver not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function updatequestion(req, res) {
  const { _id, newObject } = req.body;
  const { id, options, answers, question } = newObject;
  console.log(_id);
  const updatedQuestion = await Questions.findOneAndUpdate(
    { cover: _id },
    {
      $set: {
        [`questions.${id}.options`]: options,
        [`questions.${id}.question`]: question,
        options,
        [`answers.${id}`]: answers,
      },
    },
    { new: true }
  )
    .then((Updatedquestion) => {
      console.log("Updatedcover:", Updatedquestion);
      res.json({ msg: "Data Saved Successfully...!" });
    })
    .catch((error) => {
      res.json({ msg: "Error...!" });

      console.error("Error Updatedcover:", error);
    });
}
export async function delquestion(req, res) {
  const { id, idcover } = req.params;
  const answers = "del";
  console.log(id);
  Questions.updateOne(
    { cover: idcover },

    { $pull: { questions: { id: id }, answers: { id: id } } },
    { new: true }
  )
    .then((deletedquestion) => {
      if (!deletedquestion) {
        console.log(deletedquestion);

        return res.status(404).json({ error: "question not found" });
      }
      console.log(deletedquestion);
      return res
        .status(200)
        .json({ message: "question deleted successfully ", deletedquestion });
    })

    .catch((error) => {
      return res.json({ message: "error ", error });
    });
}
export async function attempts(req,res){


  try {
    const id = req.params.id;
   
  const result = await results.find({idcover:id}).populate('userid');
  if(result){
    res.json(result);
  }
 

else return res.status(404).json({ error: "Questionsver not found" });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
}
