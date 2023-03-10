import { useState } from "react";
import styles from "./index.module.css";


export default function Home() {
  const [foodInput, setfoodInput] = useState("");
  const [titleWords, setTitleWords] = useState();
  const [ingredientWords, setIngredientWords] = useState();
  const [instructionWords, setInstructionWords] = useState();
  const [nutritionWords, setNutritionWords] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [ingredients, setIngredients] = useState([{ id: 1, value: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showBorder, setShowBorder] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setShowImage(true);
    setIsLoading(true);
    setShowBorder(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food: foodInput }),
      });

      const data = await response.json();
      setIsLoading(false);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setTitleWords(data.titleWords);
      setIngredientWords(data.ingredientWords)
      setInstructionWords(data.instructionWords)
      setNutritionWords(data.nutritionWords)
      setImageUrl(data.imageUrl);


    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const onChange = (e, id) => {
    const newIngredients = [...ingredients];
    const index = newIngredients.findIndex((i) => i.id === id);
    newIngredients[index].value = e.target.value;
    setIngredients(newIngredients);
    setfoodInput(newIngredients.map((i) => i.value).join(","));
  };

  const addRow = () => {
    setIngredients([...ingredients, { id: Date.now(), value: "" }]);
  }

  const deleteRow = (id) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    setfoodInput(ingredients.filter((ingredient) => ingredient.id !== id)
      .map((i) => i.value)
      .join(","));
  };




  return (
    <html className={styles.page}>
      <head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1482013293005685"
        crossorigin="anonymous"></script></head>
      <div >
        <form id="ingredientsForm" onSubmit={onSubmit} className={styles.ingredientform}>
          <div className={styles.format}>
            {ingredients
              .filter((ingredient) => ingredient.value != null)
              .map((ingredient) => (
                <div key={ingredient.id} className={styles.container}>
                  <input
                    type="text"
                    placeholder="Enter an Ingredient"
                    defaultValue={ingredient.value}
                    onChange={(e) => onChange(e, ingredient.id)}
                    className={styles.ingredientform}
                  />

                  <button type="button" className={styles.deletebtn} onClick={() => deleteRow(ingredient.id)}>
                    Remove</button>
                </div>
              ))}
          </div>
          <div>
            <button type="button" onClick={addRow} className={styles.addbtn}>
              Add Ingredient
            </button>
            <br />
            <input type="submit" value="Generate Recipes" className={styles.generatebtn} />
          </div>
          <br />
          <div>
            <a target="_blank"
              className={styles.amazonbtn}
              href="https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo&amp;tag=googhydr-20&amp;hvadid=439740365166&amp;hvpos=&amp;hvexid=&amp;hvnetw=g&amp;hvrand=3841882910299123143&amp;hvpone=&amp;hvptwo=&amp;hvqmt=e&amp;hvdev=c&amp;hvdvcmdl=&amp;hvlocint=&amp;hvlocphy=9029027&amp;hvtargid=kwd-11554712357&amp;ref=pd_sl_7cf2rld4ut_e&_encoding=UTF8&tag=aidishes-20&linkCode=ur2&linkId=8da7828e5eb0765ec90e642fc07d6938&camp=1789&creative=9325">
              ORDER MISSING INGREDIENTS ON AMAZON</a>
          </div>
        </form>
        <div> {
          isLoading ? <img src="https://media.tenor.com/PB91j4e7Q6oAAAAj/pizza-food.gif" className={styles.loading} /> :
            <div classname={styles.container} style={showBorder ? { border: '20px solid #D98880' } : {}}>
              <div id="title" className={styles.title}>{titleWords}</div>
              <br />
              <br />

              <div id="ingredients" className={styles.ingredients}>{ingredientWords}</div>
              <br />
              <br />

              <div id="instructions" className={styles.instructions}>{instructionWords}</div>

              <br />
              <br />

              <div id="nutrition" className={styles.nutrition}>{nutritionWords}</div>

              <br />
              <br />

              {showImage ? <img src={imageUrl} alt="Recipe Image" className={styles.image} /> : null}

            </div>
        }
        </div>
      </div>


    </html>
  );
}

