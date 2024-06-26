import { FormEvent, useState, useEffect } from 'react'
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { key } from 'localforage';

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  //FORMATAÇÃO ANOTATION: COMPACT CURRENCY
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProps {
  data: CoinProps[]
}

export function Home() {
  const [input, setinput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [offset])

  const url = (`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)

  async function getData() {
    fetch(url)
      .then((response) => response.json())
      .then((data: DataProps) => {
        const coinsData = data.data;

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact"
        })
        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        })

        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))

          }
          return formated;
        })
        // console.log(formatedResult);

        const listCoins = [...coins, ...formatedResult]

        setCoins(listCoins);
      })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input === '') return;
    navigate(`/detail/${input}`)
  }

  function handleGetMore() {
    if(offset === 0){
      setOffset(10)
      return;
    }
    setOffset(offset + 10);
  }


  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Digite o nome da moeda...EX: bitcoin'
          value={input}
          onChange={(e) => setinput(e.target.value)}
        />
        <button type='submit'>
          <BsSearch size={30} color='#fff' />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col' >Moeda</th>
            <th scope='col' >Valor de mercado</th>
            <th scope='col' >Preço</th>
            <th scope='col' >Volume</th>
            <th scope='col' >Mudança 24h</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          {coins.length > 0 && coins.map((item) => (
            <tr className={styles.tr} key={item.id}>
              
              <img alt='Logo cripto'
              className={styles.logo}
              src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
              />
              <td className={styles.tdlabel} data-label="Moeda">

                <div className={styles.nome} >
                  <Link to={`detail/${item.id}`} >
                    <span>{item.name} | {item.symbol} </span>
                  </Link>
                </div>

              </td>

              <td className={styles.tdlabel} data-label="Valor mercado" >
                {item.formatedMarket}
              </td>
              <td className={styles.tdlabel} data-label="Preço" >
              {item.formatedPrice}
              </td>
              <td className={styles.tdlabel} data-label="Volume" >
                {item.formatedVolume}
              </td>
              <td className={Number(item.changePercent24Hr) > 0 ? styles.tdprofit : styles.tdloss}
               data-label="Mudança 24H" >
                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais...
      </button>
    </div>
  )
}

