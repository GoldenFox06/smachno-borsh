// ========================================
// 1. Пошук і фільтрація рецептів
// ========================================

// Знаходимо поле пошуку, картки та кнопки категорій.
const searchInput = document.querySelector("#recipe-search-input");
const recipeCards = document.querySelectorAll(".recipe-card");
const categoryButtons = document.querySelectorAll("button[data-category]");
const noRecipesMessage = document.querySelector("#no-recipes-message");

let selectedCategory = "all";

// Функція показує лише ті рецепти, які відповідають умовам.
function filterRecipes() {
  const searchText = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  recipeCards.forEach(function (card) {
    const recipeName = card.querySelector("h3").textContent.toLowerCase();
    const recipeDescription = card.textContent.toLowerCase();
    const recipeCategory = card.dataset.category;

    const matchesSearch =
      recipeName.includes(searchText) || recipeDescription.includes(searchText);

    const matchesCategory =
      selectedCategory === "all" || recipeCategory === selectedCategory;

    if (matchesSearch && matchesCategory) {
      card.hidden = false;
      visibleCount++;
    } else {
      card.hidden = true;
    }
  });

  // Повідомляємо, якщо збігів немає.
  noRecipesMessage.hidden = visibleCount !== 0;
}

// Запускаємо пошук під час введення тексту.
if (searchInput) {
  searchInput.addEventListener("input", filterRecipes);
}

// Фільтруємо рецепти після натискання на категорію.
categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectedCategory = button.dataset.category;

    categoryButtons.forEach(function (item) {
      const isActive = item === button;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    filterRecipes();

    document.querySelector("#recipes").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// ========================================
// 2. Демонстраційна форма підписки
// ========================================

const newsletterForm = document.querySelector("#newsletter-form");
const emailInput = document.querySelector("#email");
const formMessage = document.querySelector("#form-message");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (event) {
    // Не перезавантажуємо сторінку після надсилання форми.
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      formMessage.textContent = "Будь ласка, введіть електронну пошту.";
      return;
    }

    formMessage.textContent =
      "Дякуємо! Форму перевірено. Для справжньої підписки потрібно підключити сервер або сервіс розсилок.";

    newsletterForm.reset();
  });
}

/* ========================================
   3. Перегляд детального рецепта
   ======================================== */

const recipeSection = document.querySelector("#borscht");
const openRecipeButtons = document.querySelectorAll('[data-recipe="borscht"]');
const closeRecipeButton = document.querySelector("#close-recipe");

if (recipeSection && openRecipeButtons.length > 0) {
  openRecipeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      recipeSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

if (closeRecipeButton && recipeSection) {
  closeRecipeButton.addEventListener("click", function () {
    document.querySelector("#recipes").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

const randomRecipeButton = document.getElementById("random-recipe-button");
const randomRecipeResult = document.getElementById("random-recipe-result");

randomRecipeButton.addEventListener("click", async () => {
  randomRecipeButton.disabled = true;
  randomRecipeButton.textContent = "Завантаження...";
  randomRecipeResult.textContent = "Шукаємо для вас смачний рецепт...";

  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php",
    );

    if (!response.ok) {
      throw new Error("Не вдалося отримати дані від сервера.");
    }

    const data = await response.json();
    const recipe = data.meals?.[0];

    if (!recipe) {
      throw new Error("Рецепт не знайдено.");
    }

    const title = document.createElement("h3");
    title.textContent = recipe.strMeal;

    const image = document.createElement("img");
    image.src = recipe.strMealThumb;
    image.alt = recipe.strMeal;
    image.loading = "lazy";

    const category = document.createElement("p");
    category.textContent = "Категорія: " + (recipe.strCategory || "Не вказано");

    const area = document.createElement("p");
    area.textContent = "Кухня: " + (recipe.strArea || "Не вказано");

    const link = document.createElement("a");
    link.href = recipe.strSource || recipe.strYoutube || "#";
    link.textContent = recipe.strSource
      ? "Переглянути оригінальний рецепт"
      : recipe.strYoutube
        ? "Переглянути відео рецепта"
        : "Посилання на рецепт відсутнє";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    randomRecipeResult.replaceChildren(title, image, category, area, link);
  } catch (error) {
    randomRecipeResult.textContent =
      "Не вдалося завантажити рецепт. Перевірте інтернет-з'єднання та спробуйте ще раз.";
    console.error("Помилка завантаження рецепта:", error);
  } finally {
    randomRecipeButton.disabled = false;
    randomRecipeButton.textContent = "Знайти інший рецепт";
  }
});
