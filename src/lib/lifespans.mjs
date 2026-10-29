// Reviewed on the user's local calendar date. Estimates are not survival guarantees.
export const lifespanUpdated='2026-10-29';
export const lifespanDisclaimer='實際壽命會因個體、飲食、環境與照護方式而不同。';
export const lifespanSources={
 rabbit:{name:'RSPCA｜Rabbit care',url:'https://www.rspca.org.uk/adviceandwelfare/pets/rabbits',evidence:'家兔一般可活 8–12 年，部分更長。'},
 guinea:{name:'Merck Veterinary Manual｜Guinea pigs',url:'https://www.merckvetmanual.com/all-other-pets/guinea-pigs/description-and-physical-characteristics-of-guinea-pigs',evidence:'家養天竺鼠壽命列為 5–8 年。',sourceUpdated:'2025-10'},
 guineaVca:{name:'VCA Animal Hospitals｜Owning guinea pigs',url:'https://vcahospitals.com/know-your-pet/guinea-pigs-owning',evidence:'平均約 5–6 年，部分個體可達 8–10 年；不同於參考區間。'},
 hamster:{name:'PDSA｜Hamsters as pets',url:'https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/small-pets/hamsters-as-pets',evidence:'一般壽命 2–3 年。'},
 birds:{name:'IVIS｜Lifespan and Longevity',url:'https://www.ivis.org/library/avian-health-and-disease/lifespan-and-longevity',sourceUpdated:'2022-03-19',evidence:'表列四種鳥的年齡估計，並分列最長壽命；不是現代族群的單一平均值。'},
 birdsMerck:{name:'Merck Veterinary Manual｜Popular pet birds',url:'https://www.merckvetmanual.com/multimedia/table/popular-pet-birds',evidence:'以物種群列出的估計與 IVIS 不盡相同，不能混作單一平均值。'},
 hedgehog:{name:'Merck Veterinary Manual｜Four-toed hedgehogs',url:'https://www.merckvetmanual.com/multimedia/table/physiological-data-for-four-toed-hedgehogs',evidence:'四趾刺蝟壽命平均 4–6 年。'},
 ferret:{name:'Merck Veterinary Manual｜Ferrets',url:'https://www.merckvetmanual.com/all-other-pets/ferrets/description-and-physical-characteristics-of-ferrets',evidence:'一般壽命 6–10 年。',sourceUpdated:'2026-05'},
 meerkat:{name:'札幌市圓山動物園｜狐獴',url:'https://www.city.sapporo.jp/zoo/018-b.html',evidence:'分別列出野外與人工飼養；人工飼養為 10–15 年。',sourceUpdated:'2025-02-22'},
 meerkatSd:{name:'San Diego Zoo｜Meerkat',url:'https://animals.sandiegozoo.org/animals/meerkat',evidence:'人工照護下中位預期壽命接近 10 年，不等同最長壽命或區間上限。'},
 chinchilla:{name:'Merck Veterinary Manual｜Chinchillas',url:'https://www.merckvetmanual.com/all-other-pets/chinchillas/description-and-physical-characteristics-of-chinchillas',evidence:'一般約 10–15 年，部分家養個體可達 20 年。',sourceUpdated:'2025-09'},
 glider:{name:'Merck Veterinary Manual｜Sugar glider ownership',url:'https://www.merckvetmanual.com/all-other-pets/sugar-gliders/sugar-glider-quick-start-guide-to-ownership',evidence:'明確標示人工飼養壽命 9–12 年。'},
 gliderVca:{name:'VCA Animal Hospitals｜Owning sugar gliders',url:'https://vcahospitals.com/know-your-pet/sugar-gliders-owning',evidence:'約 10–12 年，依照護條件而異。'}
};
const entry=(rows,description,sources,note='',scope='家養動物的一般照護參考')=>({rows,description,sources,note,scope,updatedAt:lifespanUpdated});
export const lifespans={
 rabbit:entry([{label:'常見壽命',value:'約 8～12 年',source:'rabbit'}],'兔兔能陪伴我們好多年！均衡飲食、合適環境及定期健康檢查，都是照護的重要部分。',['rabbit']),
 guinea:entry([{label:'常見壽命',value:'約 5～8 年',source:'guinea'}],'天竺鼠雖然小小一隻，也需要長期細心照顧，尤其要注意牧草、維生素 C 與日常健康觀察。',['guinea','guineaVca'],'Merck 列為 5～8 年；VCA 描述平均約 5～6 年、部分可達 8～10 年。此處是照護參考區間，不是每隻個體的平均或最長壽命。'),
 hamster:entry([{label:'常見壽命',value:'約 2～3 年',source:'hamster'}],'倉鼠的生命相對短暫，更值得我們用心提供安全、舒適且符合天性的生活環境。',['hamster']),
 parrot:entry([
  {id:'sun',label:'金太陽鸚鵡',value:'約 18～25 年',source:'birds'},
  {id:'green',label:'綠頰錐尾鸚鵡',value:'約 12～15 年，部分個體可更長壽',source:'birds'},
  {id:'cockatiel',label:'玄鳳鸚鵡',value:'約 12～18 年，部分個體可更長壽',source:'birds'},
  {id:'budgie',label:'虎皮鸚鵡',value:'約 6～12 年，部分個體可更長壽',source:'birds'}
 ],'不同鸚鵡的壽命差距很大，有些鸚鵡可以陪伴飼主數十年，飼養前一定要了解長期照護需求。',['birds','birdsMerck'],'以上為依物種分列的一般壽命參考範圍，不代表每隻鳥的實際平均壽命或最長紀錄。IVIS 引述的歷史表格與 Merck 的物種群估計有差異，並非同一族群、同一統計口徑。','依四種鸚鵡分別列示的壽命參考'),
 hedgehog:entry([{label:'常見壽命',value:'約 4～6 年',source:'hedgehog'}],'刺蝟喜歡安靜，也需要合適的溫度與安全的躲藏空間。',['hedgehog'],'以常見飼養的非洲迷你刺蝟（四趾刺蝟）為例。'),
 ferret:entry([{label:'常見壽命',value:'約 6～10 年',source:'ferret'}],'雪貂充滿好奇心，喜歡探索，生活環境需要注意安全與日常健康觀察。',['ferret']),
 meerkat:entry([{label:'人工照護環境壽命參考',value:'約 10～15 年，實際個體差異可能很大',source:'meerkat'}],'狐獴具有鮮明的社會行為與警戒習性，需要符合物種需求的專業照護。',['meerkat','meerkatSd'],'圓山動物園列人工飼養約 10～15 年；San Diego Zoo 的人工照護中位預期壽命則接近 10 年。區間與中位數不是相同統計量，不混用野外數字或最長紀錄。','人工照護環境的壽命參考'),
 chinchilla:entry([{label:'常見壽命',value:'約 10～15 年，部分個體可達 20 年',source:'chinchilla'}],'龍貓的毛髮非常濃密，對高溫與潮濕環境敏感，需要長期維持適當的環境條件。',['chinchilla']),
 glider:entry([{label:'人工飼養壽命參考',value:'約 9～12 年',source:'glider'}],'蜜袋鼯是夜行性、具有社會性的動物，適當的同伴關係與環境豐富化很重要。',['glider','gliderVca'],'Merck 列人工飼養約 9～12 年；VCA 約 10～12 年。不同估計均不保證個體壽命。','人工飼養環境的壽命參考')
};
// Public copy stays concise; detailed notes and sources live in a second disclosure.
export const lifespanPublicNotes={
 guinea:'這是一般照護參考區間，不是每隻個體的平均或最長壽命。',
 parrot:'以上為依物種分列的一般壽命參考範圍，不代表每隻鳥的實際平均壽命或最長紀錄。',
 hedgehog:'以常見飼養的非洲迷你刺蝟（四趾刺蝟）為例。',
 meerkat:'此處為人工照護環境的參考，實際個體差異可能很大；不混用野外壽命或最長紀錄。',
 glider:'此處為人工飼養環境的參考區間，不保證個體壽命。'
};
