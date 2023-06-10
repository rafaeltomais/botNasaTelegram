function textNormalizer(dataToNormalize) {
    return dataToNormalize
      .normalize("NFD")
      .replace(/([^ªa-záàâãéèêíïóôõöúçñ0-9]+)/gi, "")
      .toLowerCase();
  }

module.exports = {
    textNormalizer
}