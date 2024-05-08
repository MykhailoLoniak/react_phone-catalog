import {useEffect, useState} from 'react';
import {IoIosArrowBack} from 'react-icons/io';
import {Link} from 'react-router-dom';

import {Details} from '../../../type/Details';
import {DetailsSlideFoto} from '../DetailsSlideFoto';
import {TechSpecs} from './TechSpecs';
import {About} from './About';
import {Options} from './Options';
import {getProducts} from '../../../api';
import {Products} from '../../../type/Productes';
import {ProductsSlider} from '../ProductsSlider';

import style from './ProductDetails.module.scss';
import {Breadcrumb} from '../Breadcrumb';

type Props = {
  backUrl: string;
  details: Details | undefined;
  path: string[];
};

export const ProductDetails: React.FC<Props> = ({backUrl, details, path}) => {
  const [selectColor, setSelectColor] = useState<string | null>(null);
  const [selectCapacity, setSelectCapacity] = useState<string | null>(null);
  const [produktsNewIndex, setProduktsNewIndex] = useState<number[]>([0, 4]);
  const [produkts, setProdukts] = useState<Products[]>([]);

  useEffect(() => {
    getProducts().then(data => {
      let updatedNewPrice = data;

      if (updatedNewPrice && details?.id) {
        setSelectColor(details.color);
        setSelectCapacity(details.capacity);
        updatedNewPrice = updatedNewPrice.filter(
          product => product.itemId !== details?.id,
        );
      }

      updatedNewPrice = updatedNewPrice.slice(
        produktsNewIndex[0],
        produktsNewIndex[1],
      );

      setProdukts(updatedNewPrice);
    });
  }, [produktsNewIndex, details]);

  if (!details) {
    return null;
  }

  const handleNewClick = (click: string) => {
    const numProdukts = produkts.filter(produkt => !produkt.price).length;

    setProduktsNewIndex((prevState: number[]) => {
      if (click === 'back') {
        if (prevState[0] === 0) {
          return prevState;
        }

        return [prevState[0] - 1, prevState[1] - 1];
      }

      if (prevState[1] === numProdukts) {
        return prevState;
      }

      return [prevState[0] + 1, prevState[1] + 1];
    });
  };

  return (
    <div className={style.productDetails}>
      <Breadcrumb path={path} />
      <Link to={`../${backUrl}`} className={style.productDetails__back}>
        <IoIosArrowBack className={`${style.productDetails__back_arrow}`} />
        Back
      </Link>
      <h1 className={style.productDetails__title}>{details?.name}</h1>
      <div className={style.productDetails__content}>
        <div className={style.productDetails__content_colomn1}>
          {details && <DetailsSlideFoto details={details} />}
        </div>
        <div className={style.productDetails__content_colomn2}>
          <Options
            details={details}
            selectColor={selectColor}
            setSelectColor={setSelectColor}
            selectCapacity={selectCapacity}
            setSelectCapacity={setSelectCapacity}
          />
        </div>
      </div>

      <div className={style.productDetails__content}>
        <div className={style.productDetails__content_colomn1}>
          <About />
        </div>
        <div className={style.productDetails__content_colomn2}>
          <TechSpecs details={details} />
        </div>
      </div>

      <ProductsSlider
        produkts={produkts}
        title="You may also like"
        handleClick={handleNewClick}
      />
    </div>
  );
};
