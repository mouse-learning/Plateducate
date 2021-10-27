const NutrientLimitCheck = (dataToSend, dailyTotal) => {
    // Check nutrient limits
    const energyLim = 1600;
    const proteinsLim = 50;
    const carbsLim = 100;
    const fatsLim = 70;

    var nutritionLimit = {
        limitReached: false,
        overBy: {},
    }
    if (dailyTotal.total_energy + dataToSend.energy > energyLim) {
        var totalAmount = dailyTotal.total_energy + parseInt(dataToSend.energy);
        var limitOverBy = Math.round(((totalAmount - energyLim)*100)/100);
        nutritionLimit.overBy['energy'] = limitOverBy;
        nutritionLimit.limitReached = true;
    }
    if (dailyTotal.total_proteins + dataToSend.protein > proteinsLim) {
        var totalAmount = dailyTotal.total_proteins + parseInt(dataToSend.protein);
        var limitOverBy = Math.round(((totalAmount - proteinsLim)*100)/100);
        nutritionLimit.overBy['proteins'] = limitOverBy;
        nutritionLimit.limitReached = true;
    }
    if (dailyTotal.carbs + dataToSend.carbs > carbsLim) {
        var totalAmount = dailyTotal.total_carbs + parseInt(dataToSend.carbs);
        var limitOverBy = Math.round(((totalAmount - carbsLim)*100)/100);
        nutritionLimit.overBy['carbohydrates'] = limitOverBy;
        nutritionLimit.limitReached = true;
    }
    if (dailyTotal.fats + dataToSend.fat > fatsLim) {
        var totalAmount = dailyTotal.total_fats + parseInt(dataToSend.fat);
        var limitOverBy = Math.round(((totalAmount - fatsLim)*100)/100);
        nutritionLimit.overBy['fats'] = limitOverBy;
        nutritionLimit.limitReached = true;
    }

    return nutritionLimit;
}

export default NutrientLimitCheck;
