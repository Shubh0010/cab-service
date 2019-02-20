const { runQuery } = require('../../../database/mysqlLib')

async function addAdmin() {
  const checkFirst = await checkForEmail("shubhamnegi0010@gmail.com")
  if (checkFirst) {
    const values = ["Shubham Negi", "shubhamnegi0010@gmail.com", "Shubham7", "8449458599"]
    const result = await addStaticAdmin(values)
  }

  const checkSecond = await checkForEmail("nidhi.singh.0698@gmail.com")
  if (checkSecond) {
    const values = ["Nidhi Kumari", "nidhi.singh.0698@gmail.com", "Nidhi7", "7017267410"]
    const result = await addStaticAdmin(values)
  }
}

async function checkForEmail(email) {
  const query = `select count(*) as count from admin where email = ?`
  const params = [email]
  const count = await runQuery(query, params)
  if (count[0].count == 0) return true
  return false

}

async function addStaticAdmin(values) {
  const query = "insert into admin (name,email,password,phone_number) values (?,?,?,?)"
  const count = await runQuery(query, values)

}

addAdmin()