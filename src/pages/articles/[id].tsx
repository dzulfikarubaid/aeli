import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from "./navbar";
import { FaShare } from "react-icons/fa";
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from "next/link";
import {
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceShareButton
} from "react-share";
import { FaHandsClapping, FaWhatsapp, FaFacebook } from "react-icons/fa6";
import {PiHandsClapping} from "react-icons/pi";
import {RiShareForward2Line, RiShareForwardBoxFill} from "react-icons/ri";
interface DataItem {
  id: string,
  name: string,
  content: string,
  title: string,
  create_at: string
}

function DetailArticles() {
  const [selectedArticle, setSelectedArticle] = useState<DataItem | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [value, setValue] = useState<DataItem[]>([]);
  const { query } = useRouter();
  const router = useRouter();
  const articleTitle = selectedArticle ? selectedArticle.title : "Artikel tidak ditemukan";
  const [share, setShare] = useState(false);
  useEffect(() => {
    axios.get('/api/getarticles')
      .then((res) => {
        console.log(res.data.data);
        const articles: DataItem[] = res.data.data;
        setValue(articles);
        const selected: DataItem | undefined = articles.find(item => item.id === query.id);
        if (selected) {
          setSelectedArticle(selected);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [query.id]);

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    // Membuat URL dengan parameter pencarian dan mengarahkan pengguna
    const url = `/articles?search=${searchInput}`;
    router.push(url);
  };

  useEffect(() => {
    // Mengambil nilai parameter pencarian dari URL jika ada
    const querySearch = router.query.search || '';
    setSearchInput(querySearch.toString());

    // Filter data based on searchInput
    const filteredResults:any = value.filter(({ title }: any) =>
      title.toLowerCase().includes(querySearch.toString().toLowerCase())
    );
    setFilteredData(filteredResults);
  }, [router.query.search, value]);

  const [count, setCount] = useState(0);
  const formatTimeLeft = (createdAt: string) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const timeLeftMillis = now.getTime() - createdAtDate.getTime();
    const secondsLeft = Math.floor(timeLeftMillis / 1000);

    if (secondsLeft < 60) {
      return "kurang dari 1 menit yang lalu";
    } else if (secondsLeft < 3600) {
      const minutes = Math.floor(secondsLeft / 60);
      return `pada ${minutes} ${minutes > 1 ? "menit" : "menit"} yang lalu`;
    } else if (secondsLeft < 86400) {
      const hours = Math.floor(secondsLeft / 3600);
      return `pada ${hours} ${hours > 1 ? "jam" : "jam"} yang lalu`;
    } else {
      const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
      return "pada " + createdAtDate.toLocaleDateString('id-ID', options);
    }
  };
  const updateCounter = (counterValue:any) => {
    axios.post('/api/updateCounter', { counter: counterValue })
      .then((response) => {
        // Berhasil mengirim data ke server
      })
      .catch((error) => {
        // Terjadi kesalahan dalam pengiriman data
      });
  };
  return (
    <div>
      <Navbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearchSubmit={handleSearchSubmit}
      />
      <div className="flex flex-col justify-center items-center">
        {selectedArticle && (
          <div className="w-[700px] flex flex-col gap-10">
            <h1 className="font-extrabold text-[40px]">{articleTitle}</h1>
            <div>
              <Link className='hover:border-b hover:border-black' href={`/profile/${selectedArticle.name}`}>{selectedArticle.name}</Link>
              <h1>Diposting {formatTimeLeft(selectedArticle.create_at)}</h1>
              
              <div className="flex flex-row justify-between items-center mt-10 p-3 border-t border-b">
                <div className="flex flex-row gap-2">
                  <button onClick={()=>setCount(count + 1)}><PiHandsClapping size={22}></PiHandsClapping></button>
                  <h1>{count}</h1>
                </div>
                {
                share ? 
                <div className="flex flex-row gap-6">
              <WhatsappShareButton title={`Baca artikel dari ${selectedArticle.name} dengan judul ${selectedArticle.title}`} separator=" " url={`https://aeli.vercel.app/articles/${selectedArticle.id}`}>
                <FaWhatsapp size={22}></FaWhatsapp>
              </WhatsappShareButton>
              <FacebookShareButton
                url={`https://aeli.vercel.app/articles/${selectedArticle.id}`}
                quote={"Baca artikel dari Aeli"}
                hashtag={"#aeli"}
              >
              <FaFacebook size={22}/>
              </FacebookShareButton>
              </div>
              :
              <button onClick={() => setShare(!share)}>
                  <RiShareForwardBoxFill size={22}></RiShareForwardBoxFill>
                </button>
              }
                
              </div>
              
            </div>
            <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailArticles;