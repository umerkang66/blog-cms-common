export class ApiFeatures {
  private static excludedFields = ['page', 'sort', 'limit', 'fields'];

  constructor(private query: any, private requestQuery: any) {}

  public getQuery() {
    return this.query;
  }

  public filter(): this {
    const queryObj = { ...this.requestQuery };
    // delete the reserved fields from the requestQuery clone obj
    ApiFeatures.excludedFields.forEach(el => delete queryObj[el]);

    // when url /api/v1/tours?duration[gte]=5, if duration is "greater than or equal than" then This will come out of url { duration: { gte: '5' } }

    // Replacing all the operators (gte, gt, lte, lt) with mongodb operators ($gte, $gt, $lte, $lt) (add $ sign before operators)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // changing the query
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  public limitFields(): this {
    // The Url looks like this /api/users?fields=name,email
    if (this.requestQuery.fields) {
      // mongoose expects fields separated by spaces, but we will send it comma separated.
      const fields = this.requestQuery.fields.replaceAll(',', ' ');
      this.query = this.query.select(fields);
    }

    return this;
  }

  public sort(): this {
    // req comes as api/blogs?sort=views,createdAt, if views is same then it will sort on the basis of createdAt because that is the second field
    if (this.requestQuery.sort) {
      // If we set -price here mongoose will automatically sort it in the other order
      const sortBy = this.requestQuery.sort.replaceAll(',', ' ');

      this.query = this.query.sort(sortBy);
    } else {
      // by default sort it by createdAt but in reverse order, so that newest documents will come first
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  public paginate(): this {
    // /api/v1/blogs?page=2&limit=10
    const page = parseInt(this.requestQuery.page) || 1;
    const limit = parseInt(this.requestQuery.limit) || 20;

    const skipDocuments = (page - 1) * limit;
    this.query = this.query.skip(skipDocuments).limit(limit);

    return this;
  }
}
