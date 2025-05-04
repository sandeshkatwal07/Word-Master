const scoreboard = document.querySelectorAll(".scoreboard");
const spiral = document.querySelector(".spiral");
const answerlenght= 5;
const rounds = 6; 

async function init ()
{
    let currentGuess = '';
    let curentRow =0;
    let isloading = true;
      
    //response
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resobj =  await res.json();
    const word =resobj.word.toLocaleUpperCase();
    const wordparts = word.split("");
    let done = false;
    loading(false);
    isloading =false;
    
    console.log(word);

    function addLetter(letter)
    {
        if(currentGuess.length<answerlenght)
            {
                //add the leter  to the end
                currentGuess = currentGuess+letter;
            }else{
                //replace thee letter to end
                 currentGuess = currentGuess.substring(0,currentGuess.length-1)+letter;
            }

            scoreboard[answerlenght*curentRow+currentGuess.length-1].innerText = letter;
    }

    async function commit()
    {
        if(currentGuess.length!=answerlenght)
            {
               
                return;
            }  

            isloading = true;
            loading(true);
            const res = await fetch("https://words.dev-apis.com/validate-word" , {
                method : "POST",
                body : JSON.stringify({word:currentGuess})
            });

            const resobj= await res.json();
            const validword = resobj.validword;
            //const{ validword } = resobj;

            isloading = false;
            loading(false);

            if(!validword)
                {
                    markinvalidword();
                }


            const guesspart = currentGuess.split("");
            const map = makemap(wordparts);
            console.log(map);

            for (let i=0; i<answerlenght; i++)
                {   //maark as correct
               if(guesspart[i]===wordparts[i])
                {
                    scoreboard[curentRow*answerlenght+i].classList.add("correct");
                    map[guesspart[i]]--;
                }
                }

                for (let i=0; i<answerlenght; i++)
                    {
                        if(guesspart[i]===wordparts[i])
                        {
                            
                            //do nothing, we already did it
                        }
                        else if (wordparts.includes(guesspart[i]) && map[guesspart[i]]>0 )
                            {   //mark as closed
                                scoreboard[curentRow*answerlenght+i].classList.add("wrong-place");
                                map[guesspart[i]]--;
                            }else {
                                scoreboard[curentRow*answerlenght+i].classList.add("wrrong-letter");
                            }
                    }

            curentRow++;
            

            if (currentGuess===word)
                { //win
                 alert('you win');
                 document.querySelector(".win").classList.add("winner");
                 done = true;
                 return;
                }
            
            else if(curentRow===rounds)
                {
                    alert(`you lose,the word was ${word}`);
                    done = true;
                }
                currentGuess = '';
        }

        function backspace()
            {
                currentGuess=currentGuess.substring(0,currentGuess.length-1);
                scoreboard[answerlenght*curentRow+currentGuess.length].innerText = '';
            }

            function markinvalidword ()
            {
                
                for (let i=0; i<answerlenght; i++)
                    {
                        scoreboard[curentRow*answerlenght+i].classList.add("invalid");
                    }
            }


    document.addEventListener('keydown',function handlepresskey (event)
{   
     if(done || isloading)
        {
            //do nothing
            return;
        }

    const action = event.key;
    
    if(action==='Enter')
        {
            commit();
        }else if (action==='Backspace')
            {
                backspace();
        }
        else if(isLetter(action))
            {
             addLetter(action.toLocaleUpperCase())
            }
        else {
            
            }
        return;
});
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

  function loading (isloading)
  {
    spiral.classList.toggle('show',isloading);
  }

  function makemap (array){
    const obj ={};
    for (let i=0; i<array.length; i++)
        {
            const letter= array[i];
            if (obj[letter])
                {
                    obj[letter]++;
                }else 
                {
                    obj[letter]=1;
                }

        }
        return obj;
  }

init ();