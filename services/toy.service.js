const fs = require('fs')
var toys = require('../data/toy.json')

function query(filterBy = {}) {
  let toysToDisplay = toys

  const { txt, labels, status, maxPrice } = filterBy
  console.log(filterBy)

  // filter by text
  if (txt) {
      const regExp = new RegExp(txt, 'i')
      toysToDisplay = toys.filter(toy => regExp.test(toy.name))
  }

  // filter by labels
  if (labels && labels.length) {
  }

  // filter by inStock
  if (status !== undefined) {
  }

  // filter by maxPrice
  if (maxPrice !== undefined && maxPrice !== '') {
      toysToDisplay = toysToDisplay.filter(toy => toy.price <= maxPrice)
  }

  return Promise.resolve(toysToDisplay)
}

function get(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  if (!toy) return Promise.reject('Toy not found!')

  return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  if (idx === -1) return Promise.reject('No such toy')
  const toy = toys[idx]
  if (toy.owner._id !== loggedinUser._id) return Promise.reject('Not your toy')
  toys.splice(idx, 1)

  return _saveToysToFile()
}

function save(toy, loggedinUser) {
  if (toy._id) {
    const toyToUpdate = toys.find((currToy) => currToy._id === toy._id)
    if (toyToUpdate.owner._id !== loggedinUser._id) return Promise.reject('Not your toy')
    toyToUpdate.name = toy.name
    toyToUpdate.price = toy.price
    toyToUpdate.inStock = toy.inStock
    toyToUpdate.labels = [...toy.labels]
  } else {
    toy._id = _makeId()
    toy.owner = loggedinUser
    toys.push(toy)
  }

  return _saveToysToFile().then(() => toy)
  // return Promise.resolve(toy)
}

function _makeId(length = 5) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const toysStr = JSON.stringify(toys, null, 2)
    fs.writeFile('data/toy.json', toysStr, (err) => {
      if (err) {
        return console.log(err)
      }
      console.log('The file was saved!')
      resolve();
    })
  })
}

module.exports = {
  query,
  get,
  remove,
  save,
}