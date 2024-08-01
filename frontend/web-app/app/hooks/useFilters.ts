import { ChangeEvent, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaMale, FaFemale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import { Selection } from "@nextui-org/react";
import usePaginationStore from "./usePagintationStore";

export const useFilters = () => {
  const orderByList = [{label: 'Last Active', value: 'updatedAt'}, {label: 'Newest Members', value: 'createdAt'}];
  const genderList = [{value: 'male', icon: FaMale}, {value: 'female', icon: FaFemale}];
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const router = useRouter();
  
  const {filters, setFilters} = useFilterStore();
  const {pageNumber, pageSize, setPage, totalCount} = usePaginationStore(state => ({
    pageNumber: state.pagination.pageNumber,
    pageSize: state.pagination.pageSize,
    setPage: state.setPage,
    totalCount: state.pagination.totalCount
}))

  const {gender, ageRange, orderBy, withPhoto} = filters;

  useEffect(() => {
    if(gender || ageRange || orderBy || withPhoto) {
      setPage(1);
    }
  }, [gender, ageRange, orderBy, setPage, withPhoto])

  useEffect(() => {
    startTransition(() => {
        const searchParams = new URLSearchParams();

        if (gender) searchParams.set('gender', gender.join(','));
        if (ageRange) searchParams.set('ageRange', ageRange.toString());
        if (orderBy) searchParams.set('orderBy', orderBy);
        if (pageSize) searchParams.set('pageSize', pageSize.toString());
        if (pageNumber) searchParams.set('pageNumber', pageNumber.toString());
        searchParams.set('withPhoto', withPhoto.toString());

        router.replace(`${pathname}?${searchParams}`);
    })
}, [ageRange, orderBy, gender, router, pathname, pageNumber, pageSize, withPhoto])


  const handleGenderSelect = (value: string) => {
        if(gender.includes(value)) setFilters('gender', gender.filter(g => g !== value));
        else setFilters('gender', [...gender, value]);
    }

  const handelAgeSelect = (value: number[]) => {
    setFilters('ageRange', value);
  }

  const handleOrderSelect = (value: Selection) => {
    if(value instanceof Set) {
        setFilters('orderBy', value.values().next().value);
    }
  }

  const handleWithPhotoToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters('withPhoto', e.target.checked);
  }


  return {
    orderByList,
    genderList,
    selectAge: handelAgeSelect,
    selectGender: handleGenderSelect,
    selectOrder: handleOrderSelect,
    selectWithPhoto: handleWithPhotoToggle,
    totalCount,
    filters,
    isPending
  }
}