const NutrientLimitCheck = (dataToSend) => {
    // Check nutrient limits
    var nutritionLimit = {
        limitReached: false,
        overBy: {},
    }
    if (dataToSend.energy > 500) {
        nutritionLimit.overBy['energy'] = parseInt(dataToSend.energy) - 500;
        nutritionLimit.limitReached = true;
    }
    if (dataToSend.protein > 15) {
        nutritionLimit.overBy['protein'] = parseInt(dataToSend.protein) - 15;
        nutritionLimit.limitReached = true;
    }
    if (dataToSend.carbs > 100) {
        nutritionLimit.overBy['carbohydrates'] = parseInt(dataToSend.carbs) - 100;
        nutritionLimit.limitReached = true;
    }
    if (dataToSend.fat > 20) {
        nutritionLimit.overBy['fat'] = parseInt(dataToSend.fat) - 20;
        nutritionLimit.limitReached = true;
    }


    return nutritionLimit;
}

export default NutrientLimitCheck;
