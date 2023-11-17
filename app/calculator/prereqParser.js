//Course map global variable - this will get used when the course code is needed for a specific program
let courseMap = new Map();

courseMap.set("accounting", "acct");
courseMap.set("agriculture", "agr");
courseMap.set("animal science", "ansc");
courseMap.set("anthropology", "anth");
courseMap.set("arabic", "arab");
courseMap.set("art history", "arth");
courseMap.set("arts and sciences", "asci");
courseMap.set("biochemistry", "bioc");
courseMap.set("biology", "biol");
courseMap.set("biomedical science", "biom");
courseMap.set("black canadian studies", "blck");
courseMap.set("botany", "bot");
courseMap.set("business", "bus");
courseMap.set("chemistry", "chem");
courseMap.set("chinese", "chin");
courseMap.set("classical", "clas");
courseMap.set("classics", "clas");
courseMap.set("computing and information science", "cis");
courseMap.set("crop science", "crop");
courseMap.set("culture and technology", "cts");
courseMap.set("economics", "econ");
courseMap.set("engineering", "engg");
courseMap.set("english", "engl");
courseMap.set("environmental manegement", "envm");
courseMap.set("environmental sciences", "envs");
courseMap.set("equine", "eqn");
courseMap.set("european", "euro");
courseMap.set("finance", "fin");
courseMap.set("family relations and human developement", "frhd");
courseMap.set("food science", "food");
courseMap.set("french", "fren");
courseMap.set("geography", "geog");
courseMap.set("german", "germ");
courseMap.set("greek", "grek");
courseMap.set("history", "hist");
courseMap.set("hospitality and tourism management", "htm");
courseMap.set("human resources and organizational behaviour", "hrob");
courseMap.set("human kinetics", "hk");
courseMap.set("humanities", "humn");
courseMap.set("indigenous", "indg");
courseMap.set("international developement", "idev");
courseMap.set("italian", "ital");
courseMap.set("landscape architecture", "larc");
courseMap.set("latin", "lat");
courseMap.set("linguistics", "ling");
courseMap.set("management", "mgmt");
courseMap.set("marketing and consumer", "mcs");
courseMap.set("mathematics", "math");
courseMap.set("microbiology", "micr");
courseMap.set("molecular and cellular biology", "mcb");
courseMap.set("molecular biology and genetics", "mbg");
courseMap.set("music", "musc");
courseMap.set("nanoscience", "nano");
courseMap.set("neuroscience", "neur");
courseMap.set("nutrition", "nutr");
courseMap.set("pathology", "path");
courseMap.set("philosophy", "phil");
courseMap.set("physics", "phys");
courseMap.set("plant biology", "pbio");
courseMap.set("political science", "pols");
courseMap.set("population medicine", "popm");
courseMap.set("portugese", "port");
courseMap.set("psychology", "psyc");
courseMap.set("sociology", "soc");
courseMap.set("sociology and anthropology", "soan");
courseMap.set("spanish", "span");
courseMap.set("statistics", "stat");
courseMap.set("studio art", "sart");
courseMap.set("theatre", "thst");
courseMap.set("toxicology", "tox");
courseMap.set("zoology", "zoo");

// courseString should be in the form of "CIS*1300,CIS*1201,CIS*1500"
// make sure that the string is trimmed (no spaces between commas)
function getUltimatePrereq(courseString){
   let result;

   $.ajax({
      url: 'apiCalls.php',
      method: 'POST',
      async: false,
      data: {
      action: 'callGetUltimatePrereqs', // the name of the PHP function
      param: courseString, 
      },
      success: function(response) {
         result = JSON.parse(response);
      },
      error: function(xhr, status, error) {
         console.error(error);
      },
   });

   return result;
}

function jsonToArray(prereqJSON){
    let coursesArray = [];
    for (let i = 0; i < Object.keys(prereqJSON).length; i++){
        let currentCourseNum = "course" + i;
        if (prereqJSON.hasOwnProperty(currentCourseNum)){
            coursesArray.push(prereqJSON[currentCourseNum]);
        }
    }

    return coursesArray;
}

function main (coursesString){

    let possibleCourses = [];

    const trimmedString = coursesString.replace(/\s/g, "");

    jsonData = getUltimatePrereq(trimmedString);

    possibleCourses = jsonToArray(jsonData);

    return possibleCourses;
}

function handleSubmit(){
    const inputTextBox = document.getElementById("input-text-box");
    futureCourses = main(inputTextBox.value);

    const eligibleCoursesDOM = document.getElementById("eligible-courses") ;
    eligibleCoursesDOM.innerHTML = '';

    futureCourses.forEach(element => {
        const newNode = document.createElement("p")
        newNode.style.padding = 0
        newNode.style.margin = 0
        newNode.style.paddingLeft = "18px"
        newNode.innerHTML = element
        eligibleCoursesDOM.appendChild(newNode)
    });
}

function parsePrereq( prereq){
    let outp = [];

    if(prereq[0] <= '9' && prereq[0] >= '1' && prereq.includes(" of ") && !prereq.includes("credit")){
        outp.push(prereq);
        return outp;
    }

    prereq = prereq.replace(" including ",",");
    let arr = prereq.split(",");
    let inOf = false;
    let accum = "";
    
    if(arr.length == 1)return arr;
    
    for (let e of arr) {
            
        //MAIN LOOP   ==================================================
        e = e.trim();
        
        if(inOf){
            
            if(e.slice(-1) == ')'){
                accum += e.slice(0,-1);
                outp.push(accum);
                inOf = false;
            }else accum += e+ ',';
            
        }else if(e.includes("credit") || /^[A-Z][A-Z][A-Z][A-Z]?\*[0-9][0-9][0-9][0-9]$/.test(e))//lone course or credits
            outp.push(e);
        else if( e[0] == '(' && e.slice(-1) == ')' && e.includes(" or ")){//or
            outp.push(e.slice(1, -1) );
        }else if(e[0] == '(' && e[1] <= '9' && e[1] >= '1'){//X of
            inOf = true;
            accum = e.slice(1) + ',';
        }else{
            outp.push("UNKNOWN PREREQ");
            //return null;
        } 
        //MAIN LOOP =====================================================

    }
    
    return (outp);
}

function matchPrereq (coursesTaken, prereqArray){

    for (let prereq of prereqArray){
        if (prereq == "UNKNOWN PREREQ"){
            return false;
        }

        else if (/^[0-9] of/.test(prereq)){
            let digit = parseInt(prereq[0], 10);

            for (let course of coursesTaken){
                if (prereq.toLowerCase().includes(course.toLowerCase())){
                    digit -= 1;
                }
            }

            if (digit > 0){
                return false;
            }
        }

        else if (/ credits in /.test(prereq)){ 
            let string = prereq.match(/(\d+\.\d+)\s+credits\s+in\s+(.+\s+)/);
            
            let creditsRequired = parseInt(string[1], 10);
            let program = string[2].trim();
            let programCode;
            let foundProgram;
            let numCreditsInProgram = 0;

            let programSplit = program.split(" ");

            for (let i = 0; i < programSplit.length; i++){
                let substring = programSplit.slice(0, i+1).join(' ');

                if (courseMap.has(substring.toLowerCase())){
                    programCode = courseMap.get(substring.toLowerCase());
                    foundProgram = true;
                    i = programSplit.length;
                }
            }
            if (!foundProgram){
                programCode = programSplit[0];
            }

            for (let course of coursesTaken){
                if (course.toLowerCase().includes(programCode.toLowerCase())){
                    numCreditsInProgram += 0.5;
                }
            }

            if (creditsRequired > numCreditsInProgram){
                return false;
            }
        }

        else if (/ credits/.test(prereq)){ 
            let creditsCompleted = coursesTaken.length / 2;

            let stringNumCredits = prereq.match(/^\d+\.\d+/);

            let numCreditsRequired = parseFloat(stringNumCredits[0]);

            if (numCreditsRequired > creditsCompleted){
                return false;
            }
        }

        else if (/ or /.test(prereq)){
            let digit = 1;
            
            for (let course of coursesTaken){
                if (prereq.toLowerCase().includes(course.toLowerCase())){
                    digit -= 1;
                }
            }

            if (digit > 0){
                return false;
            }
        }

        else {
            digit = 1;

            for (let course of coursesTaken){
                if (prereq.toLowerCase() == course.toLowerCase()){
                    digit -= 1;
                }
            }

            if (digit > 0){
                return false;
            }
        }
    }

    return true;

}

// returns a boolean - true if the prereq is an AND condition, false if OR
// prereq is the prerequisite string
// course is the course code of the course to be checked
function isPrereqAnd(prereq, course) {
   // locate where the course string is within the prereq string

   /*
      Or cases:
      x of ... (4 of is the max) (the bracket before the x may be either [ or (. This must be taken into account)
      course1 or course2
      or (course1, course2, ...)
   */

   /**
    * AND cases:
    * courses on their own separated by a comma
    * a singular course
    * including course1
    */

   // OR:
   // check if the course code is either immediately following or preceding the word "or"
   // check if the course is within a set of brackets that immediately follow the word "or"
   // check for the word "of", and then check if the word preceding it is numeric, then check for the preceding opening bracket
   //    - if there is a preceding bracket, everything within those brackets are OR cases
   //    - if there is no preceding bracket, everything in this prereq string is OR case

   // AND:
   // check if the prereq string is a singular course code (if length of prereq is equal to length of course)
   // check if the course code is immediately following the word "including"
   // check if the course code is immediately following and preceding a comma
   // check if the course code is immediately following comma and preceding the end of the string
   // check if the course code is immediately preceding a comma, and following the beginning of the string

}

module.exports = { parsePrereq, matchPrereq };