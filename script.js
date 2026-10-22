const menuButton=document.querySelector('.menu-toggle');
if(menuButton){
  const header=document.querySelector('.site-header');
  const nav=header?.querySelector('.main-nav');
  const navParent=nav?.parentNode;
  const navNext=nav?.nextSibling;
  let menuScrollY=0;
  if(nav&&!nav.querySelector('.menu-extra')){
    const extra=document.createElement('div');extra.className='menu-extra';
    extra.innerHTML='<p class="eyebrow">Красота / здоровье · Краснодар</p><a class="menu-address" href="contacts.html">Октябрьская ул., 181/2 к3<br>Краснодар, 350000</a><a class="menu-phone" href="tel:+79180083010">+7 (918) 008-30-10</a><a class="menu-booking" href="contacts.html#booking">Записаться <span>↗</span></a>';
    nav.append(extra);
  }
  const closeMenu=()=>{
    if(!header?.classList.contains('menu-open'))return;
    header.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('menu-open');
    nav?.classList.remove('is-mobile-open');
    if(nav&&navParent)navParent.insertBefore(nav,navNext?.parentNode===navParent?navNext:null);
    document.body.style.position='';document.body.style.top='';document.body.style.left='';document.body.style.right='';document.body.style.width='';document.body.style.overflow='';
    document.documentElement.style.overflow='';
    window.scrollTo(0,menuScrollY);
    menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');menuButton.textContent='Меню';
  };
  menuButton.addEventListener('click',()=>{
    const opened=!header.classList.contains('menu-open');
    if(opened){
      menuScrollY=window.scrollY;
      header.classList.add('menu-open');document.body.classList.add('menu-open');document.documentElement.classList.add('menu-open');
      if(nav){nav.classList.add('is-mobile-open');document.body.append(nav);}
      document.documentElement.style.overflow='hidden';
      document.body.style.position='fixed';document.body.style.top=`-${menuScrollY}px`;document.body.style.left='0';document.body.style.right='0';document.body.style.width='100%';document.body.style.overflow='hidden';
      nav?.setAttribute('aria-label','Основное меню');
    }else closeMenu();
    menuButton.setAttribute('aria-expanded',String(opened));menuButton.setAttribute('aria-label',opened?'Закрыть меню':'Открыть меню');menuButton.textContent=opened?'Закрыть':'Меню';
  });
  nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&header.classList.contains('menu-open'))closeMenu();});
}

const motionOff=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets=[...document.querySelectorAll('main > section:not(.hero), main > .category-tabs')];
revealTargets.forEach(target=>target.classList.add('reveal'));
const hero=document.querySelector('.hero');
if(hero) hero.classList.add('is-in');
if(motionOff){revealTargets.forEach(target=>target.classList.add('is-in'));}
else if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in');observer.unobserve(entry.target)}}),{threshold:.12});
  revealTargets.forEach(target=>observer.observe(target));
}else revealTargets.forEach(target=>target.classList.add('is-in'));

const catalogGrid=document.querySelector('#catalog-grid');
if(catalogGrid){
  const cards=[...catalogGrid.querySelectorAll('.catalog-card')];
  const filters=[...document.querySelectorAll('[data-category-filter]')];
  const search=document.querySelector('#catalog-search');
  const sort=document.querySelector('#catalog-sort');
  const priceFilter=document.querySelector('#catalog-price-filter');
  const count=document.querySelector('#catalog-count');
  const empty=document.querySelector('#catalog-empty');
  const formatCount=n=>`${n} ${n%10===1&&n%100!==11?'товар':n%10>=2&&n%10<=4&&!(n%100>=12&&n%100<=14)?'товара':'товаров'}`;
  const updateCatalog=()=>{
    const active=document.querySelector('[data-category-filter].is-active')?.dataset.categoryFilter||'all';
    const query=(search?.value||'').trim().toLocaleLowerCase('ru');
    const range=priceFilter?.value||'all';
    const visible=cards.filter(card=>{
      const price=Number(card.dataset.price);
      const category=card.dataset.category.split(' ');
      const fitsPrice=range==='all'||(range==='under-8000'&&price<8000)||(range==='8000-9000'&&price>=8000&&price<=9000)||(range==='over-9000'&&price>9000);
      return (active==='all'||category.includes(active))&&fitsPrice&&(!query||card.dataset.name.toLocaleLowerCase('ru').includes(query)||card.textContent.toLocaleLowerCase('ru').includes(query));
    });
    if(sort?.value==='name') visible.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name,'ru'));
    if(sort?.value==='price-asc') visible.sort((a,b)=>Number(a.dataset.price)-Number(b.dataset.price));
    if(sort?.value==='price-desc') visible.sort((a,b)=>Number(b.dataset.price)-Number(a.dataset.price));
    cards.forEach(card=>{card.hidden=!visible.includes(card)});
    visible.forEach(card=>catalogGrid.append(card));
    if(count) count.textContent=formatCount(visible.length);
    if(empty) empty.hidden=visible.length>0;
  };
  filters.forEach(button=>button.addEventListener('click',()=>{
    filters.forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});
    updateCatalog();
  }));
  search?.addEventListener('input',updateCatalog);
  sort?.addEventListener('change',updateCatalog);
  priceFilter?.addEventListener('change',updateCatalog);
}

const bookingForm=document.querySelector('#booking-form');
if(bookingForm){
  const feedback=document.querySelector('#booking-feedback');
  const dateField=bookingForm.querySelector('input[type="date"]');
  if(dateField){const today=new Date();dateField.min=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);}
  bookingForm.addEventListener('submit',event=>{
    event.preventDefault();
    const form=new FormData(bookingForm);
    feedback.textContent=`Демо-заявка: ${form.get('service')}, ${form.get('date')} в ${form.get('time')}. Данные не отправлены. Для реальной записи позвоните +7 (918) 008-30-10.`;
    feedback.classList.add('is-visible');
  });
}

const catalog=document.querySelector('#catalog-grid');
if(catalog){
  const money=value=>new Intl.NumberFormat('ru-RU').format(value)+' ₽';
  const cartKey='sibs-demo-cart';
  let items={};
  try{items=JSON.parse(localStorage.getItem(cartKey)||'{}')||{};}catch{}
  const trigger=document.createElement('button');
  trigger.className='cart-trigger';trigger.type='button';trigger.setAttribute('aria-label','Открыть корзину');
  trigger.innerHTML='Корзина <span class="cart-count">0</span>';
  const drawer=document.createElement('div');drawer.className='cart-layer';drawer.innerHTML='<button class="cart-scrim" type="button" aria-label="Закрыть корзину"></button><aside class="cart-drawer" role="dialog" aria-modal="true" aria-label="Корзина"><div class="cart-heading"><div><p class="eyebrow">SIBS · магазин</p><h2>Корзина</h2></div><button type="button" class="cart-close" aria-label="Закрыть корзину">×</button></div><div class="cart-lines"></div><div class="cart-footer"><div class="cart-total"><span>Итого</span><strong>0 ₽</strong></div><button class="button button-dark cart-checkout" type="button">Перейти к оформлению</button><p class="cart-demo-note">Демонстрационная корзина: оформление заказа пока не подключено.</p></div><form class="checkout-form" hidden><button class="checkout-back" type="button">← Вернуться в корзину</button><p class="eyebrow">Контактные данные</p><h3>Оформление заказа</h3><label>Ваше имя<input name="customer-name" autocomplete="name" placeholder="Анна Иванова" required></label><label>Электронная почта<input name="customer-email" type="email" autocomplete="email" placeholder="name@example.com" required></label><label>Ваш телефон<input name="customer-phone" type="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></label><label>Адрес доставки<input name="customer-address" autocomplete="street-address" placeholder="Город, улица, дом" required></label><label>Индекс<input name="customer-postcode" inputmode="numeric" autocomplete="postal-code" placeholder="350000"></label><label>Способ получения<select name="delivery" required><option value="0" selected>Самовывоз — бесплатно</option><option value="350">Центр, Фестивальный — 350 ₽</option><option value="450">ЗИП, 40-лет Победы, Табачная фабрика, Дубинка, Юбилейный — 450 ₽</option><option value="550">Остальные районы Краснодара — 550 ₽</option><option value="600">СДЭК до пункта выдачи — 600 ₽</option><option value="1200">СДЭК до двери — 1 200 ₽</option></select></label><p class="checkout-total">Сумма заказа с доставкой: <strong>0 ₽</strong></p><label class="checkout-consent"><input type="checkbox" required><span>Я согласен(на) на обработку персональных данных</span></label><button class="button button-dark checkout-submit" type="submit">Перейти к оплате</button><p class="checkout-feedback" aria-live="polite">Демонстрация: заказ и оплата не отправляются.</p></form></aside></div>';
  document.body.append(trigger,drawer);
  const countLabel=trigger.querySelector('.cart-count');
  const cartLines=drawer.querySelector('.cart-lines');
  const checkoutForm=drawer.querySelector('.checkout-form');
  const setCart=()=>{try{localStorage.setItem(cartKey,JSON.stringify(items));}catch{}};
  const renderCart=()=>{
    const entries=Object.entries(items).filter(([,item])=>item.qty>0);
    const qty=entries.reduce((sum,[,item])=>sum+item.qty,0);
    const total=entries.reduce((sum,[,item])=>sum+item.price*item.qty,0);
    countLabel.textContent=qty;
    cartLines.replaceChildren();
    if(!entries.length){const empty=document.createElement('p');empty.className='cart-empty';empty.textContent='В корзине пока пусто.';cartLines.append(empty);}
    entries.forEach(([key,item])=>{
      const row=document.createElement('article');row.className='cart-line';
      const info=document.createElement('div');info.className='cart-line-info';
      const title=document.createElement('strong');title.textContent=item.title;
      const price=document.createElement('span');price.textContent=money(item.price);
      info.append(title,price);
      const actions=document.createElement('div');actions.className='cart-quantity';
      [['−','decrease','Уменьшить количество'],[String(item.qty),'quantity','Количество'],['+','increase','Добавить ещё']].forEach(([label,action,aria])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.action=action;b.dataset.key=key;b.setAttribute('aria-label',aria);if(action==='quantity')b.disabled=true;actions.append(b);});
      const remove=document.createElement('button');remove.type='button';remove.className='cart-remove';remove.textContent='Убрать';remove.dataset.action='remove';remove.dataset.key=key;
      row.append(info,actions,remove);cartLines.append(row);
    });
    drawer.querySelector('.cart-total strong').textContent=money(total);
    drawer.querySelector('.cart-checkout').disabled=qty===0;
    checkoutForm.querySelector('.checkout-total strong').textContent=money(total+Number(checkoutForm.elements.delivery.value||0));
  };
  catalog.querySelectorAll('.catalog-card').forEach(card=>{
    const add=document.createElement('button');add.type='button';add.className='add-to-cart';add.textContent='Добавить в корзину';add.dataset.addToCart='';
    card.querySelector('.catalog-card-copy').append(add);
  });
  const openCart=()=>{drawer.classList.add('is-open');document.body.classList.add('cart-open');drawer.querySelector('.cart-close').focus();};
  const closeCart=()=>{drawer.classList.remove('is-open');document.body.classList.remove('cart-open');trigger.focus();};
  trigger.addEventListener('click',openCart);
  drawer.querySelector('.cart-close').addEventListener('click',closeCart);
  drawer.querySelector('.cart-scrim').addEventListener('click',closeCart);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&drawer.classList.contains('is-open'))closeCart();});
  catalog.addEventListener('click',event=>{
    const button=event.target.closest('[data-add-to-cart]');if(!button)return;
    const card=button.closest('.catalog-card');const key=card.dataset.name;const price=Number(card.dataset.price);const title=card.querySelector('h3').textContent;
    items[key]=items[key]||{title,price,qty:0};items[key].qty++;setCart();renderCart();button.textContent='Добавлено';window.setTimeout(()=>{button.textContent='Добавить в корзину';},1100);
  });
  cartLines.addEventListener('click',event=>{
    const button=event.target.closest('[data-action]');if(!button)return;const item=items[button.dataset.key];if(!item)return;
    if(button.dataset.action==='increase')item.qty++;
    if(button.dataset.action==='decrease')item.qty--;
    if(button.dataset.action==='remove'||item.qty<1)delete items[button.dataset.key];
    setCart();renderCart();
  });
  drawer.querySelector('.cart-checkout').addEventListener('click',()=>{
    drawer.querySelector('.cart-heading h2').textContent='Оформление';
    cartLines.hidden=true;drawer.querySelector('.cart-footer').hidden=true;checkoutForm.hidden=false;
    checkoutForm.querySelector('[name="customer-address"]').required=checkoutForm.elements.delivery.value!=='0';
  });
  checkoutForm.querySelector('.checkout-back').addEventListener('click',()=>{
    checkoutForm.hidden=true;cartLines.hidden=false;drawer.querySelector('.cart-footer').hidden=false;drawer.querySelector('.cart-heading h2').textContent='Корзина';
  });
  checkoutForm.elements.delivery.addEventListener('change',()=>{
    checkoutForm.querySelector('.checkout-total strong').textContent=money(Object.values(items).reduce((sum,item)=>sum+item.price*item.qty,0)+Number(checkoutForm.elements.delivery.value||0));
    checkoutForm.querySelector('[name="customer-address"]').required=checkoutForm.elements.delivery.value!=='0';
    checkoutForm.querySelector('[name="customer-postcode"]').required=['600','1200'].includes(checkoutForm.elements.delivery.value);
  });
  checkoutForm.addEventListener('submit',event=>{
    event.preventDefault();checkoutForm.querySelector('.checkout-feedback').textContent='Это демонстрация: контактные данные не отправлены, оплата не подключена. Для реального заказа позвоните +7 (918) 008-30-10.';
  });
  renderCart();
}

const cookieChoiceKey='sibs-demo-cookie-choice';
let cookieChoice='';
try{cookieChoice=localStorage.getItem(cookieChoiceKey)||'';}catch{}
if(!cookieChoice){try{cookieChoice=document.cookie.split('; ').find(part=>part.startsWith(cookieChoiceKey+'='))?.split('=')[1]||'';}catch{}}
if(!cookieChoice&&!document.querySelector('.cookie-note')){
  const cookie=document.createElement('aside');cookie.className='cookie-note';cookie.setAttribute('aria-label','Настройки cookie');
  cookie.innerHTML='<div class="cookie-copy"><p class="eyebrow">Cookies</p><p>Мы используем cookie-файлы для корректной работы сайта. Выберите, разрешать ли их использование.</p></div><div class="cookie-actions"><a href="https://sibs.one/politikaconfedentcialnisti" target="_blank" rel="noreferrer">Подробнее</a><button type="button" data-cookie-choice="reject">Отклоняю</button><button type="button" class="cookie-accept" data-cookie-choice="accept">Принимаю</button></div>';
  cookie.addEventListener('click',event=>{const button=event.target.closest('[data-cookie-choice]');if(!button)return;cookieChoice=button.dataset.cookieChoice;try{localStorage.setItem(cookieChoiceKey,cookieChoice);}catch{}try{document.cookie=`${cookieChoiceKey}=${cookieChoice}; max-age=31536000; path=/; SameSite=Lax`;}catch{}cookie.remove();});
  document.body.append(cookie);
}

