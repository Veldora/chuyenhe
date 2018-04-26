new Vue({
	el: '#main',
	data() {
		return {
			showScoreInfo: {
				info: [],
				uniInfo: null,
				year: null
			},
			universities: [],
			form: {
				tunhien: false,
				xahoi: false,
				toan: 0,
				van: 0,
				anh: 0,
				ly: 0,
				hoa: 0,
				sinh: 0,
				su: 0,
				dia: 0,
				gdcd: 0,
				nghe: 0,
				tb12: 0,
				khuyenkhich: 0,
				uutien: 0,
			},
			diemtotnghiep: null,
			messages: [],
			dh: true,
			cd: false,
			hv: false,
			datadh: JSON.parse(localStorage.getItem('datadh')) || [],
			datacd: JSON.parse(localStorage.getItem('datacd')) || [],
			datahv: JSON.parse(localStorage.getItem('datahv')) || [],
      selectedYear: null
    }
	},
	mounted() {
		fetch('./index.php?action=getUniversities&type=dh')
		.then(resp => resp.json())
		.then(json => {
			filtered = json.filter(a => a.years.length).map(a => {
				a.type = 'dh'
				return a
			})
			this.datadh = filtered
			localStorage.setItem('datadh', JSON.stringify(filtered))
			this.refresh()
		})

		fetch('./index.php?action=getUniversities&type=cd')
		.then(resp => resp.json())
		.then(json => {
			filtered = json.filter(a => a.years.length).map(a => {
				a.type = 'cd'
				return a
			})
			this.datacd = filtered
			localStorage.setItem('datacd', JSON.stringify(filtered))
			this.refresh()
		})

		fetch('./index.php?action=getUniversities&type=hv')
		.then(resp => resp.json())
		.then(json => {
			filtered = json.filter(a => a.years.length).map(a => {
				a.type = 'hv'
				return a
			})
			this.datahv = filtered
			localStorage.setItem('datahv', JSON.stringify(filtered))
			this.refresh()
		})

		this.refresh()
	},
	methods: {
		getScore(code, year, type) {
			return fetch(`./index.php?action=getScoreByYear&code=${code}&year=${year}&type=${type}`)
			.then(resp => resp.json())
		},
		showScore(uni, year) {
			Object.assign(this.showScoreInfo, {
				uniInfo: uni,
				year
			})

			this.getScore(uni.Code, year, uni.type)
			.then(json => this.showScoreInfo.info = json)
		},
		hideScore() {
			this.showScoreInfo = {
				info: [],
				uniInfo: null,
				year: null
			}
		},
		calculate() {
			let diemtotnghiep = null
			let messages = []
			let tohop = 0
			let f = Object.assign({}, this.form)
			Object.keys(f).map(a => f[a] = (parseFloat(f[a]) || 0))
			let l = 'Bạn bị điểm liệt môn '
			let truot = false

			if (!this.form.tunhien && !this.form.xahoi) {
				messages.push('Bạn chưa chọn bài thi tổ hợp')
				this.messages = messages
				return
			}

			if (this.form.tunhien) {
				if (f.ly <= 1) {
					messages.push(l + 'Vật lý')
				}
				else if (f.hoa <= 1) {
					messages.push(l + 'Hóa học')
				}
				else if (f.sinh <= 1) {
					messages.push(l + 'Sinh học')
				}
				else {
					tohop = f.ly + f.hoa + f.sinh
				}
			}

			if (this.form.xahoi) {
				if (f.su <= 1) {
					messages.push(l + 'Lịch sử')
				}
				else if (f.dia <= 1) {
					messages.push(l + 'Địa lý')
				}
				else if (f.gdcd <= 1) {
					messages.push(l + 'GDCD')
				}
				else if ((f.su + f.dia + f.gdcd) > tohop) {
					tohop = f.su + f.dia + f.gdcd
				}
			}

			if (f.toan <= 1) {
				messages.push(l + 'Toán')
				truot = true
			}
			else if (f.van <= 1) {
				messages.push(l + 'Ngữ văn')
				truot = true
			}
			else if (f.anh <= 1) {
				messages.push(l + 'Tiếng Anh')
				truot = true
			}

			if (tohop === 0) {
				truot = true
			}

			console.log({
			 	toan: f.toan, 
			 	van: f.van, 
			 	anh: f.anh, 
			 	tohop, 
			 	khuyenkhich: f.khuyenkhich, 
			 	nghe: f.nghe, 
			 	tb12: f.tb12, 
			 	uutien: f.uutien,
			 	tunhien: f.ly + f.hoa + f.sinh,
			 	xahoi: f.su + f.dia + f.gdcd,
			 	istn: this.form.tunhien,
			 	isxh: this.form.xahoi
			})

			let diem = (((f.toan + f.van + f.anh + tohop / 3 + f.khuyenkhich + f.nghe) / 4) + f.tb12) / 2 + f.uutien

			if (diem < 5) {
				messages.push('Điểm xét tốt nghiệp của bạn dưới 5')
			}

			// if (truot || diem < 5) {
			// 	messages.push('Bạn trượt tốt nghiệp')
			// }

			this.diemtotnghiep = diem
			this.messages = messages
		},
		refresh() {
			let res = []
			if (this.dh) res = res.concat(this.datadh)
			if (this.cd) res = res.concat(this.datacd)
			if (this.hv) res = res.concat(this.datahv)
			this.universities = res
		}
	},
  watch: {
    'showScoreInfo.year'(newYear) {
      if (newYear) {
        this.showScore(this.showScoreInfo.uniInfo, newYear)
      }
    }
  }
}) 