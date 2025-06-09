import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

const usePagination = (data, itemsPerPage = 6, enableInfiniteScroll = true) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedItemsCount, setDisplayedItemsCount] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const lastLoadTime = useRef(0);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get current page data (for traditional pagination)
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Get paginated data up to current page (for infinite scroll)
  const paginatedData = useMemo(() => {
    if (enableInfiniteScroll) {
      return data.slice(0, displayedItemsCount);
    } else {
      const endIndex = currentPage * itemsPerPage;
      return data.slice(0, endIndex);
    }
  }, [data, currentPage, itemsPerPage, displayedItemsCount, enableInfiniteScroll]);

  // Load more function with throttling
  const loadMore = useCallback(() => {
    const now = Date.now();
    if (isLoading || displayedItemsCount >= data.length || now - lastLoadTime.current < 500) {
      return;
    }

    lastLoadTime.current = now;
    setIsLoading(true);

    setTimeout(() => {
      setDisplayedItemsCount(prev => {
        const newCount = Math.min(prev + itemsPerPage, data.length);
        setIsLoading(false);
        return newCount;
      });
    }, 200);
  }, [isLoading, displayedItemsCount, data.length, itemsPerPage]);

  // Infinite scroll observer
  useEffect(() => {
    if (!enableInfiniteScroll || !loadingRef.current || displayedItemsCount >= data.length) {
      return;
    }

    const currentLoadingRef = loadingRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(currentLoadingRef);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableInfiniteScroll, loadMore, displayedItemsCount, data.length]);

  // Navigation functions
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const loadMoreManual = () => {
    if (enableInfiniteScroll) {
      loadMore();
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset pagination when data changes
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setDisplayedItemsCount(itemsPerPage);
    setIsLoading(false);
    lastLoadTime.current = 0;
  }, [itemsPerPage]);

  // Reset displayed items when data changes
  useEffect(() => {
    if (enableInfiniteScroll) {
      setDisplayedItemsCount(itemsPerPage);
    }
    setCurrentPage(1);
    setIsLoading(false);
  }, [data.length, itemsPerPage, enableInfiniteScroll]);

  const hasMoreItems = enableInfiniteScroll
    ? displayedItemsCount < data.length
    : currentPage < totalPages;

  return {
    currentData,
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    hasNextPage: hasMoreItems,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    loadMore: loadMoreManual,
    resetPagination,
    totalItems: data.length,
    displayedItemsCount,
    startIndex: enableInfiniteScroll ? 1 : (currentPage - 1) * itemsPerPage + 1,
    endIndex: enableInfiniteScroll ? displayedItemsCount : Math.min(currentPage * itemsPerPage, data.length),
    loadingRef,
    hasMoreItems,
    enableInfiniteScroll,
    isLoading
  };
};

export default usePagination;
