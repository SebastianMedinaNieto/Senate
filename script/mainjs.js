

Vue.createApp({
    data() {
      return {
        I: 0,
        R: 0,
        D: 0,
        total: 0,
        auxiliar: 0,
        auxiliarD: 0,
        auxiliarR: 0,
        auxiliarI: 0,
        auxiliarLengthD: 0,
        auxiliarLengthR: 0,
        auxiliarLengthI: 0,
        porcentajeTotal: 0,
        arrayPorDem: [],
        arrayPorRep: [],
        arrayPorInd: [],
        votedWithPartyD: 0,
        votedWithPartyR: 0,
        votedWithPartyI: 0,
        leastLoyal: [],
        masLeal:[],
        mostLoyal: [],
        leastEng: [],
        leastAttendace: [],
        mostEng: [],
        //  divisor para attendance y loyality arriba //
        partidos: [],
        members: [],
        selected: '',
        estados:[],
        miembrosFiltradosCiudad: [],
        miembrosFiltradosPartido: [],
        init: {
            method: "GET",
           headers: {
                 "X-API-key": "hwhzqCrXvUjxRYLCTDjbWqxwZPG4pDbKafaNTVQN"
           
             }
            },

      }
    },

      created() {

        let chamber = document.querySelector("#house") ? "house" : "senate"

        this.URLAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

        fetch(this.URLAPI, this.init)
        .then(response => response.json())
        .then(data => {

            this.members = data.results[0].members
                this.members.map(member => {
                if(!this.estados.includes(member.state)){
                    this.estados.push(member.state)
                }
                return this.estados.sort()

                })

                    this.members.map(miembro => {
                    if (miembro.party == "R") {
                        
                         this.R++
                        return this.R
                    } else if (miembro.party == "D") {
                         this.D++
                         return this.D
                    } else if (miembro.party == "ID") {
                        this.I++
                        return this.I
                    }

                })

                this.total = this.R+ this.D+ this.I ; 
                
                this.members.map(member => {
                    if (member.party == "D") {
                        this.arrayPorDem.push(member.votes_with_party_pct)
                       return this.arrayPorDem
        
                       } else if (member.party == "R") {
                       this.arrayPorRep.push(member.votes_with_party_pct)
                        return this.arrayPorRep
        
                       } else if (member.party == "ID") {
                        this.arrayPorInd.push(member.votes_with_party_pct)
                        return this.arrayPorInd }
               }) ;

               this.auxiliarD = this.arrayPorDem.reduce((a, b) => a + b, 0)
               this.auxiliarLengthD = this.arrayPorDem.length
               this.votedWithPartyD =  parseFloat((this.auxiliarD / this.auxiliarLengthD).toFixed(2))

               this.auxiliarR = this.arrayPorRep.reduce((a, b) => a + b, 0)
               this.auxiliarLengthR = this.arrayPorRep.length
               this.votedWithPartyR = parseFloat((this.auxiliarR / this.auxiliarLengthR).toFixed(2))

               this.auxiliarI = this.arrayPorInd.reduce((a, b) => a + b, 0)
               this.auxiliarLengthI = this.arrayPorInd.length
               this.votedWithPartyI = parseFloat((this.auxiliarI / this.auxiliarLengthI).toFixed(2))

               this.auxiliar = this.auxiliarD + this.auxiliarR + this.auxiliarI
               this.porcentajeTotal = parseFloat((this.auxiliar / this.total).toFixed(2))
 
        })
        
      },

      methods: {

        menorPresentismo() {
            this.leastEng = this.members.filter(leasATT => leasATT.total_votes !== 0)
            this.leastEng.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
            this.leastEng.length
            let diezPCTMiembros = (this.leastEng.length * 10) / 100 // 10.5
            let diezPCTMiembrosRed = Math.floor(diezPCTMiembros)
            this.leastAttendace = this.leastEng.slice(0, diezPCTMiembrosRed)

             for (let i = 0; i < this.leastEng.length; i++) {
             if (this.leastAttendace[this.leastAttendace.length - 1].missed_votes_pct == this.leastEng[i].missed_votes_pct && !this.leastAttendace.includes(this.leastEng[i])) {
                this.leastAttendace.push(this.leastEng[i])

            }           }

            return this.leastAttendace
        },

        mayorPresentismo() {

            this.leastEng.reverse()
            let diezPCTMiembros = (this.leastEng.length * 10) / 100 
            let diezPCTMiembrosRed = Math.floor(diezPCTMiembros)
            this.mostEng = this.leastEng.slice(0, diezPCTMiembrosRed)
    
                for (let i = 0; i < this.leastEng.length; i++) {
                    if (this.mostEng[this.mostEng.length - 1].missed_votes_pct == this.leastEng[i].missed_votes_pct && !this.mostEng.includes(this.leastEng[i])) {
                        this.mostEng.push(this.leastEng[i])
                    }
                } 
               return this.mostEng
            },

      },

      computed:{

        filtro() {

            this.miembrosFiltradosCiudad = []

            if(this.selected == "all") {
                this.miembrosFiltradosCiudad = this.members.map(member => member)
            }else if(!this.selected){
                this.miembrosFiltradosCiudad = this.members.map(member => member)
            } else {
                this.miembrosFiltradosCiudad = this.members.filter(member => member.state == this.selected)
            }
  
            this.miembrosFiltradosPartido = []
              
            this.miembrosFiltradosCiudad.forEach(miembro => {
                this.partidos.length == 0 ? this.miembrosFiltradosPartido = this.miembrosFiltradosCiudad :
                    this.partidos.forEach(partido => miembro.party == partido ? this.miembrosFiltradosPartido.push(miembro) : "")
                    return this.miembrosFiltradosPartido

                }

            )
        },

 
        
  

        masLeales() {

        this.masLeal = this.members.filter(masleal => masleal.total_votes !== 0)

        this.masLeal.sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)

        let diezPCTMiembros = (this.masLeal.length * 10) / 100
        let diezPCTMiembrosRed = Math.floor(diezPCTMiembros)
        this.mostLoyal = this.masLeal.slice(0, diezPCTMiembrosRed)

            for(let i = 0 ; i<this.masLeal.length ; i++) {
            if (this.mostLoyal[this.mostLoyal.length -1 ].votes_with_party_pct == this.masLeal[i].votes_with_party_pct && !this.mostLoyal.includes(this.masLeal[i]) ) {
                 this.mostLoyal.push(this.masLeal[i])
                }
            }
        return this.mostLoyal
        },
        
        menosLeales() {

            this.masLeal.reverse()
            let diezPCTMiembros = (this.masLeal.length * 10) / 100
            let diezPCTMiembrosRed = Math.floor(diezPCTMiembros)
            this.leastLoyal = this.masLeal.slice(0, diezPCTMiembrosRed)
    
                for(let i = 0 ; i<this.masLeal.length ; i++) {
                if (this.leastLoyal[this.leastLoyal.length -1 ].votes_with_party_pct == this.masLeal[i].votes_with_party_pct && !this.leastLoyal.includes(this.masLeal[i]) ) {
                     this.leastLoyal.push(this.masLeal[i])

                    }
                }    
                return this.leastLoyal
        },
      },

    }).mount('#app')

